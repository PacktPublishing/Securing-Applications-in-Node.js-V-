import {Router} from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {hash} from '@authentication/secure-hash';
import * as database from '../database';
import * as Views from '../views';
import {isValidPassword} from '../client/PasswordField';

const app = Router();

app.get('/register', async (req, res, next) => {
  try {
    res.send(
      renderToString(
        <Views.Register
          username={req.session.username}
          csrfToken={req.csrfToken()}
        />,
      ),
    );
  } catch (ex) {
    next(ex);
  }
});

app.post('/register', async (req, res, next) => {
  try {
    if (!isValidPassword(req.body.password)) {
      throw new Error('Invalid password');
    }
    await database.users.create(
      req.body.username,
      await hash(req.body.password),
    );
    req.session.username = req.body.username;
    res.redirect('/');
  } catch (ex) {
    next(ex);
  }
});

export default app;
