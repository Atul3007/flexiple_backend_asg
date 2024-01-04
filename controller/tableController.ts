import { Request, Response } from 'express';
import { pool } from '../db';


//-------------------------------asign table--------------------------------------

const assignTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_id = req.params.uid;

        const userQuery = 'SELECT restaurant_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            res.status(404).json({
                msg: "User not found"
            });
            return;
        }

        const restaurant_id = userResult.rows[0].restaurant_id;

        const findAvailableTableQuery = 'SELECT id FROM tables WHERE status = $1 AND restaurant_id = $2 LIMIT 1';
        const availableTableResult = await pool.query(findAvailableTableQuery, ['available', restaurant_id]);

        if (availableTableResult.rows.length === 0) {
            res.status(400).json({ msg: 'No available tables ' });
            return;
        }

        const assignedTableId = availableTableResult.rows[0].id;
      
        const assignTableQuery = 'UPDATE tables SET status = $2 WHERE id = $1';
        await pool.query(assignTableQuery, [assignedTableId, 'booked']);

        res.status(200).json({ msg: 'Table assigned and booked successfully', assignedTableId });
    } catch (error) {
        console.error('Error in assigning table:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

//------------------------------book orders---------------------------------------


const orderProcess = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_id = req.params.uid;
        const { orderedItems } = req.body;

        // Fetch restaurant_id from users table based on user_id
        const userQuery = 'SELECT restaurant_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            res.status(404).json({
                msg: "User not found"
            });
            return;
        }

        const userRestaurantId = userResult.rows[0].restaurant_id;

        const findTableQuery = 'SELECT id FROM tables WHERE status = $1 AND restaurant_id = $2 LIMIT 1';
        const tableResult = await pool.query(findTableQuery, ['booked', userRestaurantId]);

        if (tableResult.rows.length === 0) {
            res.status(400).json({ msg: 'No available tables' });
            return;
        }

        const tableId = tableResult.rows[0].id;
        
        for (const item of orderedItems) {
            const { item_id, quantity } = item;

            // Check if the menu item belongs to the user's restaurant
            const checkMenuItemQuery = 'SELECT COUNT(*) FROM menu_items WHERE id = $1 AND restaurant_id = $2';
            const checkMenuItemResult = await pool.query(checkMenuItemQuery, [item_id, userRestaurantId]);

            if (checkMenuItemResult.rows[0].count === 0) {
                res.status(400).json({ msg: 'Invalid menu item in the order' });
                return;
            }
         const insertOrderQuery = 'INSERT INTO orders (table_id, menu_item_id, quantity) VALUES ($1, $2, $3)';
            await pool.query(insertOrderQuery, [tableId, item_id, quantity]);
        }

        res.status(200).json({ msg: 'Order process completed successfully' });
    } catch (error) {
        console.error('Error in order process:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

//-----------------------------payment orders-------------------------------------

const paymentProcess = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tableId } = req.body;

        // Check if the table has any pending orders
        const checkOrdersQuery = 'SELECT * FROM orders WHERE table_id = $1';
        const checkOrdersResult = await pool.query(checkOrdersQuery, [tableId]);

        if (checkOrdersResult.rows.length === 0) {
            res.status(400).json({ msg: 'No pending orders for the specified table' });
            return;
        }
//console.log(checkOrdersResult.rows)
        // Calculate the total amount for the order
        let totalAmount = 0;
        for (const order of checkOrdersResult.rows) {
            const {menu_item_id, quantity } = order;

            // Query to get the price of the menu item
            const getMenuPriceQuery = 'SELECT price FROM menu_items WHERE id = $1';
            const getMenuPriceResult = await pool.query(getMenuPriceQuery, [menu_item_id]);

            if (getMenuPriceResult.rows.length > 0) {
                const menuItemPrice = getMenuPriceResult.rows[0].price;
                totalAmount += menuItemPrice * quantity;
            }
        }
//console.log(totalAmount)
        // Insert payment details into the payments table
        const insertPaymentQuery =
            'INSERT INTO payments (order_id, amount, payment_date) VALUES ($1, $2, CURRENT_DATE) RETURNING order_id';
        const insertPaymentResult = await pool.query(insertPaymentQuery, [tableId, totalAmount]);

        const orderId = insertPaymentResult.rows[0].order_id;

        // Update the status of the table to 'available'
        const updateTableStatusQuery = 'UPDATE tables SET status = $2 WHERE id = $1';
        await pool.query(updateTableStatusQuery, [tableId, 'available']);

        res.status(200).json({ msg: 'Payment process completed successfully', orderId });
    } catch (error) {
        console.error('Error in payment process:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


export {
    assignTable,
    orderProcess,
    paymentProcess
}