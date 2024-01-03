import { Request, Response } from 'express';
import { pool } from '../db';
import { hashpass } from '../helper/authHelper';


//-------------------------------get users--------------------------------------

const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(201).json(result.rows);
    } catch (error) {
        console.error("Error in gettin users:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//----------------------------------register users-----------------------------------------------

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, phone, email, password, address, role, restaurant_id } = req.body;

        if (!username || !phone || !email || !password || !address || !restaurant_id) {
            res.status(400).json({
                msg: "All fields are required"
            });
            return;
        }
        const hashedPassword = await hashpass(password);
        const result = await pool.query(
            'INSERT INTO users (username, phone, email, password, address, role, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [username, phone, email, hashedPassword, address, role, restaurant_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
    return;
};

//-------------------------------login user----------------------------------------------



export { getUser , registerUser};
