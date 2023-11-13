import express, { Application } from 'express';
import mustacheExpress from 'mustache-express';

// routes
import transactionsRouter from '../routes/transactions';

// utils
import { addTransaction, deleteTransaction } from '../utils/data';

export const web: Application = express();
web.use(express.json());
web.use(express.static('public'));

// parsing request
web.use(express.urlencoded({ extended: true }));

web.set('views', './src/views');
web.set('view engine', 'mustache');
web.engine('mustache', mustacheExpress());

web.use(transactionsRouter);

web.post('/', (req, res) => {
  // validate here
  interface Body {
    type: string;
    category: string;
    amount: number;
    description?: string;
  }
  const request: Body = req.body;

  const transaction = {
    id: +new Date(),
    date: new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    type: request.type,
    category: request.category,
    amount: Number(request.amount),
    description: request.description,
  };

  addTransaction(transaction);

  res.redirect('/');
});

web.get('/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  deleteTransaction(id);

  res.redirect('/');
});
