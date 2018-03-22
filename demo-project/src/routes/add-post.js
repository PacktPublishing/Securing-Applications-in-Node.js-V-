import {Router} from 'express';
import * as database from '../database';
import * as views from '../views';

const app = Router();

app.post('/add-post', async (req, res, next) => {
  try {
    if (req.session.username) {
      await database.posts.create(req.session.username, req.body.body);
    }
    res.redirect('/');
  } catch (ex) {
    next(ex);
  }
});

export default app;
