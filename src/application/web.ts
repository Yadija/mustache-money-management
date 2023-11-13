import express, { Application } from 'express';
import mustacheExpress from 'mustache-express';

// routes
import transactionsRouter from '../routes/transactions';

// utils
import { deleteTransaction } from '../utils/data';

export const web: Application = express();
web.use(express.json());
web.use(express.static('public'));

// parsing request
web.use(express.urlencoded({ extended: true }));

web.set('views', './src/views');
web.set('view engine', 'mustache');
web.engine('mustache', mustacheExpress());

web.use(transactionsRouter);

web.get('/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  deleteTransaction(id);

  res.redirect('/');
});
