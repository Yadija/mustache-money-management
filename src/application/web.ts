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

    const history = response.transactions
      .map((transaction: any) => {
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
      })
      .reverse();

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

    // set date
    let from: number | string, to: number | string;
    let month = Number(req.query.month);
    let year = Number(req.query.year);
    if (!month) {
      month = new Date().getMonth() + 1;
    }
    if (!year) {
      year = new Date().getFullYear();
    }

    from = new Date(year, month - 1, 1).getTime();
    to = new Date(year, month, 0, 23, 59, 59).getTime();

    // get data for charts
    const dataChart = response.transactions
      .map((transaction: any) => {
        if (transaction.id >= from && transaction.id <= to) {
          return {
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
          };
        }
      })
      .filter((item: any) => item !== undefined);

    const getData = (type: string) => {
      return dataChart
        .filter((data: any) => data.type === type)
        .map((data: any) => data.category)
        .filter((value: number, index: number, self: number[]) => self.indexOf(value) === index) // remove duplicate
        .reduce((accumulator: any, value: any) => {
          return { ...accumulator, [value]: 0 };
        }, {});
    };
    const incomes = getData('income');
    const expenses = getData('expense');

    dataChart.forEach((data: any) => {
      if (data.type === 'income') {
        incomes[data.category] += data.amount;
      } else if (data.type === 'expense') {
        expenses[data.category] += data.amount;
      }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    Object.values(incomes).forEach((value: any) => {
      totalIncome += value;
    });
    Object.values(expenses).forEach((value: any) => {
      totalExpense += value;
    });

    const setDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    };
    from = setDate(from);
    to = setDate(to);

    return {
      history,
      annuals,
      years,
      incomes,
      expenses,
      totalIncome: totalIncome.toLocaleString('id-ID'),
      totalExpense: totalExpense.toLocaleString('id-ID'),
      total: (totalIncome - totalExpense).toLocaleString('id-ID'),
      stringDate: `${from} - ${to}`,
    };
  };

  const { history, annuals, years, incomes, expenses, totalIncome, totalExpense, total, stringDate } = loadData();

  res.render('home', {
    title: 'Home',
    annuals: JSON.stringify(annuals),
    years,
    history,
    incomes: JSON.stringify(incomes),
    expenses: JSON.stringify(expenses),
    totalIncome,
    totalExpense,
    total,
    stringDate,
  });
});
