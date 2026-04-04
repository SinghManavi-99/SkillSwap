import express from 'express'
import { googleAuth, unlinkGoogle } from '../controllers/oauth.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/google — verify Google token and login/register
router.post('/google', googleAuth)

// DELETE /api/auth/google/unlink — unlink Google from account
router.delete('/google/unlink', protect, unlinkGoogle)

export default router