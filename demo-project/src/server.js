import 'dotenv/config';
import express from 'express';
import {urlencoded, json} from 'body-parser';
import cookieSession from 'cookie-session';
import csurf from 'csurf';
import csrfProtection from '@authentication/csrf-protection';
import Routes from './routes';

const app = express();

app.use(csrfProtection());

app.use(express.static(__dirname + '/public'));

app.use(
  cookieSession({
    name: 'session',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: ['some random key'],
  }),
);

app.use(urlencoded({extended: false}));
app.use(json());

app.use(csurf());

app.use(Routes);

app.use(express.static(__dirname + '/../public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
