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
  const dataAnnual = './data/annual.json';
  const loadData = () => {
    const annuals = JSON.parse(fs.readFileSync(dataAnnual, 'utf8')).annuals;
    const getYears = annuals.map((item: any) => item.year).sort((a: any, b: any) => b - a);

    const data = () => {
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

      return {
        history,
      };
    };

    const { history } = data();
    return {
      annuals,
      years: getYears,
      history,
    };
  };

  res.render('home', {
    title: 'Home',
    annuals: JSON.stringify(loadData().annuals),
    years: loadData().years,
    history: loadData().history,
  });
});
