import {Router} from 'express';
import * as database from '../database';
import * as views from '../views';

const app = Router();

app.get('/register', async (req, res, next) => {
  try {
    res.send(
      views.register({
        username: req.session.username,
        csrfToken: req.csrfToken(),
      }),
    );
  } catch (ex) {
    next(ex);
  }
});

app.post('/register', async (req, res, next) => {
  try {
    if (req.body.password !== req.body.passwordConfirmation) {
      throw new Error('Password missmatch');
    }
    await database.users.create(req.body.username, req.body.password);
    req.session.username = req.body.username;
    res.redirect('/');
  } catch (ex) {
    next(ex);
  }
});

export default app;
