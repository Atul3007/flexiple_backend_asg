import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import { pool } from '../db';


let user_id: string | undefined;

const requireSignin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jwtSecretKey = "asdglkjklj09876";
        const token: string | undefined = req.headers.authorization;

        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded: any = jwt.verify(token, jwtSecretKey, { expiresIn: '500s' } as VerifyOptions);

        if (decoded) {
            user_id = decoded.id;
            next();
        }
    } catch (error) {
        res.status(400).json({ message: "error in auth-middleware" });
        console.log("error in auth-middleware", error);
    }
};

const checkRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = `SELECT role, restaurant_id FROM users WHERE id = $1`;
        const result = await pool.query(query, [user_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found in the database" });
            return;
        }

        const userRole = result.rows[0].role;

        if (userRole == "manager") {
            next();
        } else {
            res.status(403).json({ message: "Not a manager" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const checkAdminRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = `SELECT role FROM admin WHERE id = $1`;
        const result = await pool.query(query, [user_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found in the database" });
            return;
        }

        const userRole = result.rows[0].role;

        if (userRole == "admin") {
            next();
        } else {
            res.status(403).json({ message: "Not a admin" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    requireSignin,
    checkRole,
    checkAdminRole
};
