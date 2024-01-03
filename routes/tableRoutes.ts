import express from 'express';
import { checkRole, requireSignin } from '../middlewares/authMiddleware';
import { assignTable, orderProcess, paymentProcess } from '../controller/tableController';

const tableRouter = express.Router();


tableRouter.get('/assign-table',requireSignin,checkRole,assignTable);
tableRouter.post('/order',requireSignin,checkRole,orderProcess);
tableRouter.post('/payment',requireSignin,checkRole,paymentProcess)

export default tableRouter