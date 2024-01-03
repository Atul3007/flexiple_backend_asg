import { Request, Response } from 'express';
import { pool } from '../db';

//-------------------------------get restaurants--------------------------------------

const getRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM restaurants');
        res.status(201).json(result.rows);
    } catch (error) {
        console.error("Error in getting restaurant details:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//------------------------------add restaurant--------------------------------------------

const addRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, location } = req.body;

        const restaurantInsertQuery = `
            INSERT INTO restaurants (name, location)
            VALUES ($1, $2)
            RETURNING id;
        `;
        const restaurantValues = [name, location];

        const restaurantResult = await pool.query(restaurantInsertQuery, restaurantValues);
        const restaurantId = restaurantResult.rows[0].id;

        const tablesInsertQuery = `
            INSERT INTO tables (restaurant_id, status)
            VALUES ${Array(10).fill(`(${restaurantId}, 'available')`).join(', ')}
        `;

        await pool.query(tablesInsertQuery);

        res.status(201).json({ msg: "Restaurant and tables added successfully" });
    } catch (error) {
        console.error("Error in adding restaurant:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//------------------------------edit restaurant--------------------------------------------

const editRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const { name, location } = req.body;

        const updateRestaurantQuery = `
            UPDATE restaurants
            SET name = $1, location = $2
            WHERE id = $3;
        `;
        const updateRestaurantValues = [name, location, id];

        await pool.query(updateRestaurantQuery, updateRestaurantValues);

        res.status(200).json({ msg: "Restaurant updated successfully" });
    } catch (error) {
        console.error("Error in editing restaurant:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//------------------------------delete restaurant-------------------------------------------

const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;

        const updateActiveStatusQuery = `
            UPDATE restaurants
            SET active = false
            WHERE id = $1;
        `;

        await pool.query(updateActiveStatusQuery, [id]);

        res.status(200).json({ msg: "Restaurant deactivated successfully" });
    } catch (error) {
        console.error("Error in deleting restaurant:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


export {
    getRestaurant,
    addRestaurant,
    editRestaurant,
    deleteRestaurant
}