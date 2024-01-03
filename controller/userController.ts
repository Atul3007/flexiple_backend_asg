import { Request, Response } from 'express';
import { pool } from '../db';
import { hashpass,comparePass } from '../helper/authHelper';
import jwt from 'jsonwebtoken';

const jwtSecretKey = "asdglkjklj09876";

//-------------------------------get users--------------------------------------

const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(201).json(result.rows);
    } catch (error) {
        console.error("Error in getting users:", error);
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

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
             res.status(400).json({
                msg: "All fields are required"
            });
            return;
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
             res.status(401).json({
                msg: "Invalid email or password"
            });
            return;
        }

        const user = result.rows[0];

        if(user.active){

        if (await comparePass(password, user.password)) {
            const token = jwt.sign({ id: user.id }, jwtSecretKey);
            res.status(200).json({
                msg: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    token,
                    email: user.email,
                    status: user.active
                }
            });
        } else {
            res.status(401).json({
                msg: "Invalid email or password"
            });
        }
    }else{
        res.status(400).json({
            message:"No longer a user."
        })
    }
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//--------------------------------login admin----------------------------------------------

const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
             res.status(400).json({
                msg: "All fields are required"
            });
            return;
        }

        const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);

        if (result.rows.length === 0) {
             res.status(401).json({
                msg: "Invalid email or password"
            });
            return;
        }

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id }, jwtSecretKey);
        if(password==user.password){
            res.status(200).json({
                msg: "Login successful as a admin",
                user: {
                    id: user.id,
                    username: user.username,
                    token,
                    email: user.email
                }
            });
        }
         else {
            res.status(401).json({
                msg: "Invalid email or password"
            });
        }
   
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

//------------------------------Delete user-----------------------------------------------

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const query = 'UPDATE users SET active = false WHERE id = $1 RETURNING *';
        const values = [id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({
                msg: "User not found"
            });
            return;
        }

        res.status(200).json({
            msg: "User disable successfully",
            menu_item: result.rows[0]
        });
        
    } catch (error) {
        console.error("Error in deleting menu item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export { getUser , registerUser , loginUser , deleteUser , loginAdmin};
