import express, { Application } from 'express';
import mustacheExpress from 'mustache-express';

export const web: Application = express();
web.use(express.json());
web.use(express.static('public'));

web.set('views', './src/views');
web.set('view engine', 'mustache');
web.engine('mustache', mustacheExpress());

web.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    content: 'Welcome to the home page',
  });
});
