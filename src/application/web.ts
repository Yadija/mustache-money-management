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
    const response = JSON.parse(fs.readFileSync(dataAnnual, 'utf8')).annuals;
    const getYears = response.map((item: any) => item.year).sort((a: any, b: any) => b - a);

    return {
      annuals: response,
      years: getYears,
    };
  };

  res.render('home', {
    title: 'Home',
    annuals: JSON.stringify(loadData().annuals),
    years: loadData().years,
  });
});
