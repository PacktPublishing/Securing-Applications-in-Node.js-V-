import {Router} from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import * as database from '../database';
import * as Views from '../views';
import AddPost from './add-post';
import Logout from './logout';
import PasswordReset from './password-reset';
import TwoFactorAuth from './2-factor-auth';

const app = Router();

app.get('/', async (req, res, next) => {
  if (req.session.verifiedEmail && !req.session.username) {
    res.redirect('/2-factor-auth/verify');
    return;
  }
  try {
    const posts = await database.posts.list();
    res.send(
      renderToString(
        <Views.Home
          username={req.session.username}
          posts={posts}
          csrfToken={req.csrfToken()}
        />,
      ),
    );
  } catch (ex) {
    next(ex);
  }
});

app.use(AddPost);
app.use(Logout);
app.use(PasswordReset);
app.use(TwoFactorAuth);

export default app;
