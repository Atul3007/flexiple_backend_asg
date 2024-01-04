import { Request, Response } from 'express';
import { pool } from '../db';

//-------------------------------get menu--------------------------------------

const getMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM menu_items WHERE active = $1', [true]);
        res.status(201).json(result.rows);
    } catch (error) {
        console.error("Error in getting menu item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//-------------------------------add-menu---------------------------------------
const addMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_id = req.params.u_id;
       
        const { name, price } = req.body;
       
        if (!name || !price ) {
            res.status(400).json({
                msg: "Name, price, and active are required fields"
            });
            return;
        }

        // Fetch restaurant_id based on user_id
        const userQuery = 'SELECT restaurant_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            res.status(404).json({
                msg: "User not found"
            });
            return;
        }

        const restaurant_id = userResult.rows[0].restaurant_id;

        const menuQuery = 'INSERT INTO menu_items (name, price, restaurant_id) VALUES ($1, $2, $3) RETURNING *';
        const menuValues = [name, price, restaurant_id];

        const menuResult = await pool.query(menuQuery, menuValues);

        res.status(201).json({
            msg: "Menu item added successfully",
            menu_item: menuResult.rows[0]
        });
    } catch (error) {
        console.error("Error in posting menu item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//--------------------------------edit menu--------------------------------------

const editMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_id = req.params.u_id;
        const menu_id = req.params.menu_id;
        const { name, price } = req.body;

        if (!user_id || !name || !price) {
            res.status(400).json({
                msg: "user_id, name, and price are required fields"
            });
            return;
        }

        const userQuery = 'SELECT restaurant_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            res.status(404).json({
                msg: "User not found"
            });
            return;
        }

        const restaurant_id = userResult.rows[0].restaurant_id;
   
        const query = 'UPDATE menu_items SET name = $1, price = $2 WHERE restaurant_id = $3 AND id = $4 RETURNING *';
        const values = [name, price, restaurant_id, menu_id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({
                msg: "Menu item not found or does not belong to the specified user"
            });
            return;
        }

        res.status(200).json({
            msg: "Menu item updated successfully",
            menu_item: result.rows[0]
        });
    } catch (error) {
        console.error("Error in updating menu item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//------------------------------delete menu---------------------------------------
const deleteMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_id = req.params.u_id;
        const menu_id = req.params.menu_id;

        // Fetch restaurant_id based on user_id
        const userQuery = 'SELECT restaurant_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            res.status(404).json({
                msg: "User not found"
            });
            return;
        }

        const restaurant_id = userResult.rows[0].restaurant_id;

        const query = 'UPDATE menu_items SET active = false WHERE id = $1 AND restaurant_id = $2 RETURNING *';
        const values = [menu_id, restaurant_id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({
                msg: "Menu item not found or does not belong to the specified user"
            });
            return;
        }

        res.status(200).json({
            msg: "Menu item deleted successfully",
            menu_item: result.rows[0]
        });
        
    } catch (error) {
        console.error("Error in deleting menu item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

      
export {
    getMenu,
    addMenu,
    editMenu,
    deleteMenu
}