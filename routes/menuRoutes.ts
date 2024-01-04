import express from 'express';
import { addMenu, deleteMenu, editMenu, getMenu } from "../controller/menuController"
import { checkRole, requireSignin } from '../middlewares/authMiddleware';

const menuRouter = express.Router();


menuRouter.get('/get-menu',getMenu);
menuRouter.post('/add-menu/:u_id/',requireSignin,checkRole,addMenu);
menuRouter.patch('/edit-menu/:u_id/:menu_id',requireSignin,checkRole,editMenu);
menuRouter.delete('/delete-menu/:u_id/:menu_id',requireSignin,checkRole,deleteMenu);


export default menuRouter;