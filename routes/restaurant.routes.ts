import express from 'express';
import { checkAdminRole, requireSignin } from '../middlewares/authMiddleware';
import { addRestaurant, deleteRestaurant, editRestaurant, getRestaurant } from '../controller/restaurantController';

const restaurantRouter = express.Router();


restaurantRouter.get('/get-restaurant',getRestaurant);
restaurantRouter.post('/add-restaurant',requireSignin,checkAdminRole,addRestaurant);
restaurantRouter.patch('/edit-restaurant/:id',requireSignin,checkAdminRole,editRestaurant);
restaurantRouter.delete('/delete-restaurant/:id',requireSignin,checkAdminRole,deleteRestaurant);


export default restaurantRouter;