import { Request, Response } from 'express';
import { pool } from '../db';


//-------------------------------asign table--------------------------------------

const assignTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const findAvailableTableQuery = "SELECT id FROM tables WHERE status = 'available' LIMIT 1";
        const availableTableResult = await pool.query(findAvailableTableQuery);

        if (!availableTableResult.rows.length) {
            res.status(400).json({ msg: 'No available tables' });
            return;
        }

        const assignedTableId = availableTableResult.rows[0].id;
       //console.log(assignedTableId)
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
        const { tableId, orderedItems } = req.body; // array of objects

        for (const item of orderedItems) {
            const { item_id, quantity } = item;

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
            const {menu_item_id, quantity,id } = order;

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