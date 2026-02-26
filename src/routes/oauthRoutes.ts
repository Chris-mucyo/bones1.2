import { Router, type Router as ExpressRouter } from 'express';
import passport from 'passport';
import { googleCallback } from '../controllers/OauthController';

const router: ExpressRouter = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.OAUTH_FAILURE_URL,
  }),
  googleCallback
);

export default router;