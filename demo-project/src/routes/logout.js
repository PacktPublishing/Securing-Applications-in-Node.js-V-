import {Router} from 'express';
import * as database from '../database';
import * as views from '../views';

const app = Router();

app.post('/logout', async (req, res, next) => {
  try {
    req.session.username = undefined;
    req.session.verifiedEmail = undefined;
    res.redirect('/');
  } catch (ex) {
    next(ex);
  }
});

export default app;
