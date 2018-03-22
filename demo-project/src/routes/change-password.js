import {Router} from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {hash} from '@authentication/secure-hash';
import * as database from '../database';
import * as Views from '../views';
import {isValidPassword} from '../client/PasswordField';

const app = Router();

app.get('/change-password', async (req, res, next) => {
  try {
    res.send(
      renderToString(
        <Views.ChangePassword
          username={req.session.username}
          csrfToken={req.csrfToken()}
        />,
      ),
    );
  } catch (ex) {
    next(ex);
  }
});

app.post('/change-password', async (req, res, next) => {
  try {
    if (!req.session.username) {
      throw new Error('You must be authenticated');
    }
    if (!isValidPassword(req.body.password)) {
      throw new Error('Invalid password');
    }
    await database.users.updatePassword(
      req.session.username,
      await hash(req.body.password),
    );
    res.redirect('/');
  } catch (ex) {
    next(ex);
  }
});

export default app;
