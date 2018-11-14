import FacebookAuthentication from '@authentication/facebook';
import {Router} from 'express';

process.env.FACEBOOK_APP_ID = '263821234318708';
process.env.FACEBOOK_APP_SECRET = '20dc3bd9d1f514d308b98d290d5a244e';

const app = Router();

const facebookAuthentication = new FacebookAuthentication({
  callbackURL: '/auth/facebook',
});

app.post(facebookAuthentication.callbackPath, async (req, res, next) => {
  facebookAuthentication.redirectToProvider(req, res, next);
});

app.get(facebookAuthentication.callbackPath, async (req, res, next) => {
  try {
    if (facebookAuthentication.userCancelledLogin(req)) {
      return res.redirect('/');
    }
    const {
      accessToken, // use this to make requests to the Facebook API on behalf of the user
      refreshToken,
      profile,
      state, // => {message: 'Hello world'}
    } = await facebookAuthentication.completeAuthentication(req, res);
    req.session.username = `${profile.provider}:${profile.id}`;
    res.redirect('/');
  } catch (ex) {
    next(ex);
  }
});

export default app;
