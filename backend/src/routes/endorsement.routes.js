import express from 'express'
import { body } from 'express-validator'
import {
  createEndorsement,
  getUserEndorsements,
  deleteEndorsement,
  getUserVerification,
  submitIdentityVerification,
  adminVerifySkill,
  adminReviewIdentity,
} from '../controllers/endorsement.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// All endorsement routes require authentication
router.use(protect)

// ─── GET /api/endorsements/user/:userId ──────────────────────────────
// Get all endorsements for a user
// Returns: {
//   endorsements[],          — raw list
//   bySkill[],               — grouped by skill with count + endorsers
//   total
// }
// Swap-partner endorsements have higher weight than community ones
router.get('/user/:userId', getUserEndorsements)

// ─── GET /api/endorsements/verification/:userId ───────────────────────
// Get a user's verification status + badge level
// Returns: {
//   identityStatus,          — unverified | pending | verified | rejected
//   badgeLevel,              — none | bronze | silver | gold
//   verifiedSkills[],        — skills verified by admin
//   emailVerified,
//   ...
// }
// Badge logic:
//   Gold   = email + identity + 2 verified skills
//   Silver = email + identity
//   Bronze = email only
router.get('/verification/:userId', getUserVerification)

// ─── POST /api/endorsements ───────────────────────────────────────────
// Endorse a specific skill of another user
// Cannot endorse yourself
// One endorsement per endorser→endorsee→skill triplet
// If swapId provided + swap is completed between these users → higher weight
// On success: notifies endorsee via notification + email
// Body: { endorseeId, skillId, note?, swapId? }
router.post(
  '/',
  [
    body('endorseeId')
      .notEmpty()
      .withMessage('Endorsee user ID is required'),
    body('skillId')
      .notEmpty()
      .withMessage('Skill ID is required'),
    body('note')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Note max 200 characters'),
    body('swapId')
      .optional()
      .isMongoId()
      .withMessage('swapId must be a valid ID'),
  ],
  validate,
  createEndorsement
)

// ─── POST /api/endorsements/verify-identity ───────────────────────────
// Submit identity verification document for admin review
// Sets identityStatus: 'pending'
// Admin will approve/reject via PATCH /api/endorsements/verify-identity/:userId
// Body: { documentType, documentRef }
// documentType: aadhar | passport | driving_license | student_id
router.post(
  '/verify-identity',
  [
    body('documentType')
      .isIn(['aadhar', 'passport', 'driving_license', 'student_id'])
      .withMessage('Invalid document type'),
    body('documentRef')
      .notEmpty()
      .withMessage('Document reference is required'),
  ],
  validate,
  submitIdentityVerification
)

// ─── DELETE /api/endorsements/:id ─────────────────────────────────────
// Withdraw (delete) an endorsement you gave
// Only the endorser can withdraw their own endorsement
router.delete('/:id', deleteEndorsement)

// ─── ADMIN ONLY ROUTES ────────────────────────────────────────────────

// ─── POST /api/endorsements/verify-skill ──────────────────────────────
// Admin: manually verify a user's skill (after demo/certificate/test)
// Adds skill to user's verifiedSkills[] and recomputes badge level
// Body: { userId, skillId, method, certificateUrl? }
// Methods: demo | certificate | test | portfolio
router.post(
  '/verify-skill',
  adminOnly,
  [
    body('userId').notEmpty().withMessage('User ID required'),
    body('skillId').notEmpty().withMessage('Skill ID required'),
    body('method')
      .isIn(['demo', 'certificate', 'test', 'portfolio'])
      .withMessage('Method must be demo, certificate, test, or portfolio'),
  ],
  validate,
  adminVerifySkill
)

// ─── PATCH /api/endorsements/verify-identity/:userId ──────────────────
// Admin: approve or reject an identity verification request
// On approve: sends notification + email + recomputes badge level
// Body: { status, reason? }
// Status: verified | rejected
router.patch(
  '/verify-identity/:userId',
  adminOnly,
  [
    body('status')
      .isIn(['verified', 'rejected'])
      .withMessage('Status must be verified or rejected'),
    body('reason')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Reason max 500 characters'),
  ],
  validate,
  adminReviewIdentity
)

export default router