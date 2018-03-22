import {Router} from 'express';
import * as database from '../database';
import * as views from '../views';

const app = Router();

app.get('/login', async (req, res, next) => {
  try {
    res.send(views.login({username: req.session.username}));
  } catch (ex) {
    next(ex);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const user = await database.users.get(req.body.username);
    if (user && user.password === req.body.password) {
      req.session.username = req.body.username;
      res.redirect('/');
    } else {
      throw new Error('Incorrect password');
    }
  } catch (ex) {
    next(ex);
  }
});

export default app;
