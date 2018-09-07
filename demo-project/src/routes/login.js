import {Router} from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import * as database from '../database';
import * as Views from '../views';

const app = Router();

app.get('/login', async (req, res, next) => {
  try {
    res.send(
      renderToString(
        <Views.Login
          username={req.session.username}
          csrfToken={req.csrfToken()}
        />,
      ),
    );
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
