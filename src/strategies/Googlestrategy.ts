import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';

export const initGoogleStrategy = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:     process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL:  process.env.GOOGLE_CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email  = profile.emails?.[0]?.value;
          const avatar = profile.photos?.[0]?.value;
          const name   = profile.displayName;

          if (!email) {
            return done(new Error('No email returned from Google'), undefined);
          }

          let user = await User.findOne({ email });

          if (user) {
            if (user.provider !== 'google') {
              user.provider   = 'google';
              user.providerId = profile.id;
              user.avatar     = avatar;
              user.isVerified = true;
              await user.save();
            }
            return done(null, user.toObject() as any);
          }

          user = await User.create({
            name,
            email,
            provider:   'google',
            providerId: profile.id,
            avatar,
            isVerified: true,
            role:       'buyer',
          });

          return done(null, user.toObject() as any);

        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};