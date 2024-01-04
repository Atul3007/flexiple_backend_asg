import express from 'express';
import {deleteUser, getUser, loginAdmin, loginUser, registerManager, registerUser} from "../controller/userController";
import { checkAdminRole, checkRole, requireSignin } from '../middlewares/authMiddleware';


const router = express.Router();

router.post('/admin/log-in',loginAdmin)

router.get('/get-user', getUser);
router.post("/reg-manager",requireSignin,checkAdminRole, registerManager);
router.post("/reg-staff/:uid",requireSignin,checkRole, registerUser);
router.post("/login-user",loginUser);
router.delete("/delete-user/:id",requireSignin,checkRole,deleteUser)

export default router;
