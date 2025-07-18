import express from 'express';
import passport from 'passport';
import { URL } from 'url';

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  (req, res, next) => {
    const { state, redirect_uri } = req.query;
    const authState = state || '{}';
    
    // Store the redirect_uri in the session if provided
    if (redirect_uri) {
      req.session.redirect_uri = redirect_uri;
    }
    
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: authState,
      accessType: 'offline',
      prompt: 'consent',
      session: true, // Enable sessions for OAuth flow
    })(req, res, next);
  }
);

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: `${process.env.CLIENT_URL}/login?error=authentication_failed`,
      failureMessage: true,
      session: true // Enable sessions for OAuth flow
    }, async (err, user, info) => {
      if (err) {
        console.error('Google OAuth error:', err);
        const errorMessage = encodeURIComponent(err.message || 'Authentication failed');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${errorMessage}`);
      }
      
      if (!user) {
        const message = info?.message ? encodeURIComponent(info.message) : 'Authentication failed';
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${message}`);
      }
      
      try {
        // Log in the user (establishes the session)
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error('Login error:', loginErr);
            return res.redirect(`${process.env.CLIENT_URL}/login?error=login_failed`);
          }
          
          // Get the redirect URL from session or use default
          const redirectUrl = req.session.redirect_uri || `${process.env.CLIENT_URL}/dashboard`;
          
          // Clear the redirect_uri from session
          if (req.session.redirect_uri) {
            delete req.session.redirect_uri;
          }
          
          // Parse the original state if it exists
          const url = new URL(redirectUrl);
          
          // Add any state parameters back to the URL
          if (req.query.state) {
            try {
              const state = JSON.parse(decodeURIComponent(req.query.state));
              Object.entries(state).forEach(([key, value]) => {
                if (value !== undefined) {
                  url.searchParams.set(key, String(value));
                }
              });
            } catch (e) {
              console.error('Error parsing state:', e);
            }
          }
          
          // Redirect to the final destination
          return res.redirect(url.toString());
        });
      } catch (error) {
        console.error('Error during authentication:', error);
        const errorMessage = encodeURIComponent('Error during authentication');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${errorMessage}`);
      }
    })(req, res, next);
  }
);

export default router;
