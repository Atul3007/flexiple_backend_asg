import express from 'express';
import { checkRole, requireSignin } from '../middlewares/authMiddleware';
import { assignTable, orderProcess, paymentProcess } from '../controller/tableController';

const tableRouter = express.Router();


tableRouter.get('/assign-table/:uid',requireSignin,assignTable);
tableRouter.post('/order/:uid',requireSignin,checkRole,orderProcess);
tableRouter.post('/payment/',requireSignin,checkRole,paymentProcess)

export default tableRouter