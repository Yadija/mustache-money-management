import express, { Application } from 'express';
import mustacheExpress from 'mustache-express';
import fs from 'fs';

export const web: Application = express();
web.use(express.json());
web.use(express.static('public'));

web.set('views', './src/views');
web.set('view engine', 'mustache');
web.engine('mustache', mustacheExpress());

web.get('/', (req, res) => {
  const loadData = () => {
    const response = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

    const history = response.transactions.map((transaction: any) => {
      // format category
      transaction.category = transaction.category[0].toUpperCase() + transaction.category.slice(1);

      // format date
      transaction.date = new Date(transaction.date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      // set amount by type
      if (transaction.type === 'expense') {
        return {
          ...transaction,
          amount: -transaction.amount,
        };
      }

      return transaction;
    });

    // get years from transactions
    const years = response.transactions
      .map((transaction: any) => {
        return new Date(transaction.id).getFullYear();
      })
      .filter((value: number, index: number, self: number[]) => self.indexOf(value) === index)
      .sort((a: number, b: number) => b - a);

    // get annuals
    const annuals = years.map((year: number) => {
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const incomeMonths = months.map((month: number) => {
        return {
          month,
          value: 0,
        };
      });
      const expenseMonths = months.map((month: number) => {
        return {
          month,
          value: 0,
        };
      });

      return {
        year,
        incomes: incomeMonths,
        expenses: expenseMonths,
      };
    });

    // fill annuals
    annuals.forEach((annual: any) => {
      response.transactions.forEach((transaction: any) => {
        if (new Date(transaction.id).getFullYear() === annual.year) {
          const indexMonth = new Date(transaction.id).getMonth();

          if (transaction.type === 'income') {
            annual.incomes[indexMonth].value += transaction.amount;
          } else if (transaction.type === 'expense') {
            annual.expenses[indexMonth].value += transaction.amount;
          }
        }
      });
    });

    return {
      history,
      annuals,
      years,
    };
  };

  const { history, annuals, years } = loadData();

  res.render('home', {
    title: 'Home',
    annuals: JSON.stringify(annuals),
    years,
    history,
  });
});
