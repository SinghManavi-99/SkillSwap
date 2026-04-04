import express from 'express'
import { body } from 'express-validator'
import {
  createSwap,
  getMySwaps,
  getSwapById,
  updateSwapStatus,
  sendMessage,
} from '../controllers/swap.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// All swap routes require authentication
router.use(protect)

// ─── GET /api/swaps ──────────────────────────────────────────────────
// Get all my swaps (as requester or provider)
// Query params:
//   status  — filter by status (pending, accepted, in_progress, completed, cancelled, rejected)
//   role    — 'requester' or 'provider' (defaults to both)
router.get('/', getMySwaps)

// ─── GET /api/swaps/:id ──────────────────────────────────────────────
// Get a single swap with full details:
//   - requester + provider info
//   - skillOffered + skillWanted info
//   - full chat messages array (populated with sender name/avatar)
// Only participants can access
router.get('/:id', getSwapById)

// ─── POST /api/swaps ─────────────────────────────────────────────────
// Send a new swap request
// Body: { providerId, skillOfferedId, skillWantedId, message?, sessionFormat? }
// Business rules enforced:
//   - Cannot swap with yourself
//   - Duplicate prevention (same skills + same users already has active swap)
//   - Provider must exist and be active
// On success: notifies provider via Socket.io + email
router.post(
  '/',
  [
    body('providerId')
      .notEmpty()
      .withMessage('Provider ID is required'),
    body('skillOfferedId')
      .notEmpty()
      .withMessage('Skill offered ID is required'),
    body('skillWantedId')
      .notEmpty()
      .withMessage('Skill wanted ID is required'),
    body('sessionFormat')
      .optional()
      .isIn(['online', 'in_person'])
      .withMessage('sessionFormat must be online or in_person'),
    body('message')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Message max 500 characters'),
  ],
  validate,
  createSwap
)

// ─── PATCH /api/swaps/:id/status ─────────────────────────────────────
// Update swap status — enforces role-based business rules:
//
//   pending  → accepted   (provider only)
//   pending  → rejected   (provider only)
//   pending  → cancelled  (either party)
//   accepted → in_progress (requester only — session started)
//   accepted → cancelled  (either party)
//   in_progress → completed (requester only)
//   in_progress → cancelled (either party)
//
// Body: { status, cancellationReason?, scheduledAt? }
// On status change: notifies other party via Socket.io + email
router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'])
      .withMessage('Invalid status value'),
    body('cancellationReason')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Cancellation reason max 500 chars'),
    body('scheduledAt')
      .optional()
      .isISO8601()
      .withMessage('scheduledAt must be a valid date'),
  ],
  validate,
  updateSwapStatus
)

// ─── POST /api/swaps/:id/messages ────────────────────────────────────
// Send a chat message within a swap
// Only works when swap status is 'accepted' or 'in_progress'
// Message is saved to MongoDB AND broadcast via Socket.io
// Body: { text }
router.post(
  '/:id/messages',
  [
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Message text cannot be empty')
      .isLength({ max: 1000 })
      .withMessage('Message max 1000 characters'),
  ],
  validate,
  sendMessage
)

export default router