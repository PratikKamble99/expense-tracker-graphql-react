import passport from "passport";
import bcrypt from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

import User from "../models/user.model.js";

dotenv.config();

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("Serializing the User");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserializing user");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) throw new Error("invalid username OR password");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("invalid password");

        done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true,
        proxy: true // Trust the proxy to handle HTTPS in production
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await User.findOne({ googleId: profile.id });
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error('No email provided by Google'));
          }

          if (!user) {
            // Check if a user with this email already exists
            const existingUser = await User.findOne({ email });
            
            if (existingUser) {
              // If user exists but signed up with email/password, update with Google ID
              if (!existingUser.googleId) {
                existingUser.googleId = profile.id;
                existingUser.isEmailValid = true; // Mark email as verified
                await existingUser.save();
                return done(null, existingUser);
              }
              // If user exists with a different Google ID
              return done(null, false, { message: 'An account already exists with this email.' });
            }

            // Create new user if doesn't exist
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            user = new User({
              googleId: profile.id,
              email,
              username: email.split('@')[0],
              name: profile.displayName,
              password: hashedPassword,
              gender: 'male', // Default gender, can be updated later
              isVerified: true, // Google-verified emails are considered verified
              isEmailValid: true, // Mark email as valid since it's verified by Google
              profilePicture: profile.photos?.[0]?.value || '', // Save profile picture if available
            });
            await user.save();
          } else if (user.email !== email) {
            // If the email has changed in Google, update it
            user.email = email;
            user.isEmailValid = true;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};
