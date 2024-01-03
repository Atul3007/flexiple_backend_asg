import express from 'express';
import {getUser, registerUser} from "../controller/userController"

const router = express.Router();


router.get('/get-user', getUser);
router.post("/reg-user", registerUser)

export default router;
