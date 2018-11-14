import PasswordlessAuthentication, {
  VerifyPassCodeStatusKind,
} from '@authentication/passwordless';
import getTransport from '@authentication/send-message';
import {Router} from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import * as database from '../database';
import * as Views from '../views';

const app = Router();

const passwordlessAuthentication = new PasswordlessAuthentication({
  callbackURL: '/auth/passwordless/callback',
  store: {
    tokens: database.tokens,
    rateLimit: database.rateLimit('passwordless'),
  },
});

// We need a way to send people the e-mails.  See:
// https://www.atauthentication.com/docs/send-message.html
const mailTransport = getTransport();

app.get('/login', async (req, res, next) => {
  try {
    res.send(
      renderToString(<Views.PasswordReset csrfToken={req.csrfToken()} />),
    );
  } catch (ex) {
    next(ex);
  }
});

// The first step is for the client to call this API to create a token
// The state is then sent back to the user
// N.B. You must not send the magicLink or passCode anywhere **except** the e-mail.
app.post('/auth/passwordless/create-token', async (req, res, next) => {
  try {
    const userID = req.body.email;
    const result = await passwordlessAuthentication.createToken(
      req,
      res,
      userID,
      req.body.redirectURL,
    );
    if (result.created) {
      const {magicLink, passCode} = result;
      await mailTransport.sendMail({
        from: 'noreply@example.com',
        to: userID,
        subject: 'Confirm your e-mail',
        text:
          'Thank your for signing in to ' +
          magicLink.hostname +
          '. Please enter the following code into the box provided:\n\n  ' +
          passCode +
          '\n\nor click this "magic" link:\n\n  ' +
          magicLink.href,
        html: `
            <p>
              Thank your for signing in to
              <a href="${magicLink.href}">${magicLink.hostname}</a>.
              Please enter the following code into the box provided:
            </p>
            <p style="font-size: 40px; font-weight: bold; margin: 20px;">
              ${passCode}
            </p>
            <p>or click:</p>
            <a
              style="display:inline-block;background:blue;font-size:40px;font-weight:bold;margin:20px;padding:20px;border-radius:4px;color:white;text-decoration:none;"
              href="${magicLink.href}"
            >
              Magic Link
            </a>
          `,
      });
    }
    res.json(result.status);
  } catch (ex) {
    next(ex);
  }
});

// If the user types in a pass code, it will call this API to complete the login process.
// You can store the resulting userID in the session, as well as sending the `status` back
// to the client to complete the loign
app.post('/auth/passwordless/verify-pass-code', async (req, res, next) => {
  try {
    const result = await passwordlessAuthentication.verifyPassCode(req, res, {
      passCode: req.body.passCode,
    });
    if (result.verified) {
      const {userID} = result;
      req.session.username = userID;
    }
    res.json(result.status);
  } catch (ex) {
    next(ex);
  }
});

// The callback handles the "magic" link. It logs the user in, and in a real app
// would then redirect the user to where they were logging in to
app.get(passwordlessAuthentication.callbackPath, async (req, res, next) => {
  try {
    const result = await passwordlessAuthentication.verifyPassCode(req, res);
    if (result.verified) {
      const {userID, state} = result;
      req.session.username = userID;
      res.redirect(state);
    } else {
      const {status} = result;
      res
        .status(
          status.kind === VerifyPassCodeStatusKind.ExpiredToken ? 429 : 400,
        )
        .send(status.message);
    }
  } catch (ex) {
    next(ex);
  }
});

export default app;
