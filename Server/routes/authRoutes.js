import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).send('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.')
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next)
})

router.get('/google/callback', (req, res, next) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${clientUrl}/login?error=oauth_not_configured`)
  }
  passport.authenticate('google', { session: false, failureRedirect: `${clientUrl}/login` }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${clientUrl}/login?error=auth_failed`)
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' })
    res.redirect(`${clientUrl}/login?token=${token}`)
  })(req, res, next)
})

export default router;