import { Request, Response } from 'express';

// services
import transactionsService from '../services/transactionsService';

const getTransactionController = (request: Request, response: Response) => {
  const history = transactionsService.getHistory();
  const years = transactionsService.getYears();
  const annuals = transactionsService.getAnnuals();

  // set date
  let from: number | string, to: number | string;
  let month = Number(request.query.month);
  let year = Number(request.query.year);
  if (!month) {
    month = new Date().getMonth() + 1;
  }
  if (!year) {
    year = new Date().getFullYear();
  }

  from = new Date(year, month - 1, 1).getTime();
  to = new Date(year, month, 0, 23, 59, 59).getTime();

  const { incomes, expenses, totalIncome, totalExpense } = transactionsService.getTransactions(from, to);

  from = transactionsService.setDate(from);
  to = transactionsService.setDate(to);

  response.render('home', {
    title: 'Home',
    annuals: JSON.stringify(annuals),
    incomes: JSON.stringify(incomes),
    expenses: JSON.stringify(expenses),
    years,
    history,
    totalIncome: totalIncome.toLocaleString('id-ID'),
    totalExpense: totalExpense.toLocaleString('id-ID'),
    total: (totalIncome - totalExpense).toLocaleString('id-ID'),
    stringDate: `${from} - ${to}`,
    message: request.flash('message'),
  });
};

const postTransactionController = (request: Request, response: Response) => {
  transactionsService.addData(request.body);
  request.flash('message', 'Data has been added');

  response.redirect('/');
};

const deleteTransactionById = (request: Request, response: Response) => {
  const id = Number(request.params.id);
  transactionsService.deleteTransactionById(id);
  request.flash('message', 'Data has been deleted');

  response.redirect('/');
};

export default { getTransactionController, postTransactionController, deleteTransactionById };
