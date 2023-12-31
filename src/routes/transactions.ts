import express from 'express';

// controllers
import transactionsController from '../controllers/transactionsController';

const transactionsRouter = express.Router();
transactionsRouter.get('/', transactionsController.getTransactionController);
transactionsRouter.post('/', transactionsController.postTransactionController);
transactionsRouter.get('/delete/:id', transactionsController.deleteTransactionById);

export default transactionsRouter;
