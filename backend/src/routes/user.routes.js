import express from 'express'
import { body } from 'express-validator'

import {
  getAllUsers,
  getUserById,
  updateProfile,
  updateSkills,
  getMatches,
  deactivateAccount,
  getProfile // ✅ ADD THIS
} from '../controllers/user.controller.js'

import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// 🔐 All user routes require authentication
router.use(protect)


// ✅ 1. CURRENT USER PROFILE (ADD THIS)
router.get('/me', getProfile)


// ✅ 2. MATCHES
router.get('/matches', getMatches)


// ✅ 3. ALL USERS
router.get('/', getAllUsers)


// ❗ ALWAYS LAST (dynamic route)
router.get('/:id', getUserById)


// ─── UPDATE PROFILE ───────────────────────────────────────────
router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional().isLength({ max: 300 }).withMessage('Bio max 300 chars'),
  ],
  validate,
  updateProfile
)


// ─── UPDATE SKILLS ────────────────────────────────────────────
router.put(
  '/skills',
  [
    body('skillsOffered').optional().isArray().withMessage('skillsOffered must be an array'),
    body('skillsWanted').optional().isArray().withMessage('skillsWanted must be an array'),
  ],
  validate,
  updateSkills
)


// ─── DELETE ACCOUNT ───────────────────────────────────────────
router.delete('/me', deactivateAccount)

export default router