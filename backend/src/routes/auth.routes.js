import express from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  googleAuth,
  getMe,
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// ─── POST /api/auth/register ──────────────────────────────────────────
// Register new user with name, email, password
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
)


// ─── POST /api/auth/login ─────────────────────────────────────────────
// Login with email and password → returns JWT token
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

// ─── POST /api/auth/google ────────────────────────────────────────────
// Google OAuth login/register → verifies Google ID token → returns JWT
router.post(
  '/google',
  [
    body('credential').notEmpty().withMessage('Google credential is required'),
  ],
  validate,
  googleAuth
)

// ─── GET /api/auth/me ─────────────────────────────────────────────────
// Get current logged-in user's profile (requires JWT)
router.get('/me', protect, getMe)

export default router