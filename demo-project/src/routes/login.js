import {Router} from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {verify} from '@authentication/secure-hash';
import {
  ExponentialRateLimit,
  BucketRateLimit,
} from '@authentication/rate-limit';
import * as database from '../database';
import * as Views from '../views';

const app = Router();

const globalRateLimit = new BucketRateLimit(database.rateLimit('global'), {
  interval: '1s',
  maxSize: 100,
});
const ipRateLimit = new BucketRateLimit(database.rateLimit('ip'), {
  interval: '5s',
  maxSize: 10,
});
const userRateLimit = new ExponentialRateLimit(database.rateLimit('user'), {
  baseDelay: '1 second',
  factor: 2,
  freeAttempts: 1,
});

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
    await ipRateLimit.consume(req.ip);
    await globalRateLimit.consume('global');
    const user = await database.users.get(req.body.username);
    await userRateLimit.consume(req.body.username);
    if (
      user &&
      (await verify(
        req.body.password,
        user.password,
        async updatedPasswordHash => {
          await database.users.updatePassword(
            req.body.username,
            updatedPasswordHash,
          );
        },
      ))
    ) {
      await userRateLimit.reset(req.body.username);
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
