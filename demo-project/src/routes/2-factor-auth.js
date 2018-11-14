import {
  generateSecret,
  getQRCodeURI,
  verifyToken,
} from '@authentication/google-authenticator';
import {Router} from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import * as database from '../database';
import * as Views from '../views';

const app = Router();

app.get('/2-factor-auth/register', async (req, res, next) => {
  if (!req.session.username) {
    res.sendStatus(403);
    return;
  }
  try {
    const secret = await generateSecret();
    const qrCode = await getQRCodeURI({
      secret,
      label: 'Securing:' + req.session.username,
      issuer: 'Securing',
    });
    res.send(
      renderToString(
        <Views.RegisterTwoFactorAuth
          username={req.session.username}
          csrfToken={req.csrfToken()}
          qrCode={qrCode}
          secret={secret}
        />,
      ),
    );
  } catch (ex) {
    next(ex);
  }
});

app.post('/2-factor-auth/register', async (req, res, next) => {
  if (!req.session.username) {
    res.sendStatus(403);
    return;
  }
  if (
    true !==
    verifyToken({
      secret: req.body.secret,
      token: req.body.token,
    })
  ) {
    res.redirect('/2-factor-auth/register');
    return;
  }
  await database.users.updateTwoFactorSecret(
    req.session.username,
    req.body.secret,
  );
  res.redirect('/');
});

app.get('/2-factor-auth/verify', async (req, res, next) => {
  if (!req.session.verifiedEmail) {
    res.sendStatus(403);
    return;
  }
  try {
    res.send(
      renderToString(
        <Views.VerifyTwoFactorAuth
          username={req.session.username}
          csrfToken={req.csrfToken()}
        />,
      ),
    );
  } catch (ex) {
    next(ex);
  }
});

app.post('/2-factor-auth/verify', async (req, res, next) => {
  if (!req.session.verifiedEmail) {
    res.sendStatus(403);
    return;
  }
  const user = await database.users.get(req.session.verifiedEmail);
  if (!user) {
    res.sendStatus(403);
    return;
  }

  if (
    true !==
    verifyToken({
      secret: user.twoFactorSecret,
      token: req.body.token,
    })
  ) {
    res.redirect('/2-factor-auth/verify');
    return;
  }
  req.session.username = req.session.verifiedEmail;
  res.redirect('/');
});

export default app;
