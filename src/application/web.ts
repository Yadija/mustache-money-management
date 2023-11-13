import express, { Application } from 'express';
import mustacheExpress from 'mustache-express';
import session from 'express-session';
import flash from 'connect-flash';

// routes
import transactionsRouter from '../routes/transactions';

export const web: Application = express();
web.use(express.json());
web.use(express.static('public'));

// parsing request
web.use(express.urlencoded({ extended: true }));

web.set('views', './src/views');
web.set('view engine', 'mustache');
web.engine('mustache', mustacheExpress());

web.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
web.use(flash());

web.use(transactionsRouter);
