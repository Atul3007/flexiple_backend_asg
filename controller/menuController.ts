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
        const { name, price, restaurant_id, active } = req.body;

        if (!name || !price || !restaurant_id || active === undefined) {
             res.status(400).json({
                msg: "All fields are required"
            });
            return;
        }

        const query = 'INSERT INTO menu_items (name, price, restaurant_id, active) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, price, restaurant_id, active];

        const result = await pool.query(query, values);

        res.status(201).json({
            msg: "Menu item added successfully",
            menu_item: result.rows[0]
        });
    } catch (error) {
        console.error("Error in posting menu item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//--------------------------------edit menu--------------------------------------

const editMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        //console.log(id)
        const { name, price, restaurant_id } = req.body;

        if (!id || !name || !price || !restaurant_id) {
            res.status(400).json({
                msg: "All fields are required, and pass id in params"
            });
            return;
        }

        const query = 'UPDATE menu_items SET name = $1, price = $2, restaurant_id = $3 WHERE id = $4 RETURNING *';
        const values = [name, price, restaurant_id, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({
                msg: "Menu item not found"
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
        const id = req.params.id;
        const query = 'UPDATE menu_items SET active = false WHERE id = $1 RETURNING *';
        const values = [id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({
                msg: "Menu item not found"
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