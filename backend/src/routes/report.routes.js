import express from 'express'
import { body } from 'express-validator'
import {
  createDispute,
  getMyDisputes,
  getDisputeById,
  addDisputeMessage,
  getAllDisputes,
  resolveDispute,
} from '../controllers/dispute.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// All dispute routes require authentication
router.use(protect)

// ─── GET /api/disputes/my ────────────────────────────────────────────
// Get all disputes where I am either raisedBy or against
// Sorted newest first
// NOTE: must be before /:id
router.get('/my', getMyDisputes)

// ─── GET /api/disputes/:id ───────────────────────────────────────────
// Get a single dispute with:
//   - raisedBy + against user info
//   - full thread messages with sender info
//   - resolvedBy admin info
// Accessible by: dispute parties OR admin
router.get('/:id', getDisputeById)

// ─── POST /api/disputes ──────────────────────────────────────────────
// Raise a new dispute about a swap
// Rules:
//   - Must be a swap participant
//   - Cannot have another open dispute on the same swap
//   - High priority assigned automatically to harassment/inappropriate
// Body: { swapId, type, title, description, evidence[]? }
// Types: no_show | skill_mismatch | inappropriate | session_quality | cancellation | other
// On create: notifies the other party via notification
router.post(
  '/',
  [
    body('swapId')
      .notEmpty()
      .withMessage('Swap ID is required'),
    body('type')
      .isIn(['no_show', 'skill_mismatch', 'inappropriate', 'session_quality', 'cancellation', 'other'])
      .withMessage('Invalid dispute type'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Dispute title is required')
      .isLength({ max: 100 })
      .withMessage('Title max 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 20 })
      .withMessage('Please describe the issue in at least 20 characters')
      .isLength({ max: 2000 })
      .withMessage('Description max 2000 characters'),
  ],
  validate,
  createDispute
)

// ─── POST /api/disputes/:id/message ──────────────────────────────────
// Add a message to the dispute thread
// Accessible by: dispute parties OR admin
// Admin messages are flagged with isAdmin: true
// Notifies the other party on new message
// Body: { message }
router.post(
  '/:id/message',
  [
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message cannot be empty')
      .isLength({ max: 1000 })
      .withMessage('Message max 1000 characters'),
  ],
  validate,
  addDisputeMessage
)

// ─── ADMIN ONLY ROUTES ────────────────────────────────────────────────

// ─── GET /api/disputes ───────────────────────────────────────────────
// Admin: get ALL disputes (paginated + filtered)
// Query params: status, priority, page, limit
// Sorted by priority DESC then createdAt DESC
router.get('/', adminOnly, getAllDisputes)

// ─── PATCH /api/disputes/:id/resolve ─────────────────────────────────
// Admin: resolve or dismiss a dispute
// On resolve: notifies both parties via notification + email
// If outcome is 'swap_cancelled' → automatically cancels the swap
// Body: { status, resolution, outcome }
// Status: resolved | dismissed
// Outcomes: warning_issued | swap_cancelled | user_suspended | no_action
router.patch(
  '/:id/resolve',
  adminOnly,
  [
    body('status')
      .isIn(['resolved', 'dismissed'])
      .withMessage('Status must be resolved or dismissed'),
    body('resolution')
      .trim()
      .notEmpty()
      .withMessage('Resolution explanation is required')
      .isLength({ max: 1000 })
      .withMessage('Resolution max 1000 characters'),
    body('outcome')
      .isIn(['warning_issued', 'swap_cancelled', 'user_suspended', 'no_action'])
      .withMessage('Invalid outcome'),
  ],
  validate,
  resolveDispute
)

export default router