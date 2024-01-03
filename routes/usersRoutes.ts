import express from 'express';
import {deleteUser, getUser, loginUser, registerUser} from "../controller/userController";
import { checkRole, requireSignin } from '../middlewares/authMiddleware';


const router = express.Router();


router.get('/get-user', getUser);
router.post("/reg-user", registerUser);
router.post("/login-user",loginUser);
router.delete("/delete-user/:id",requireSignin,checkRole,deleteUser)

export default router;
