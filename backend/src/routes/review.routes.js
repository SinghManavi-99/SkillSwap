import express from 'express'
import { body } from 'express-validator'
import {
  createReview,
  getUserReviews,
  deleteReview,
} from '../controllers/review.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// ─── GET /api/reviews/user/:userId ───────────────────────────────────
// Get all reviews for a specific user
// Returns: { reviews[], average, total }
// Public — no auth needed
router.get('/user/:userId', getUserReviews)

// ─── POST /api/reviews ───────────────────────────────────────────────
// Submit a review after a completed swap (requires auth)
// Rules:
//   - Swap must have status 'completed'
//   - Only swap participants can review
//   - One review per swap per reviewer (unique index enforced)
//   - Auto-updates reviewee's reputationScore + totalSwapsCompleted
// Body: { swapId, rating (1-5), comment? }
router.post(
  '/',
  protect,
  [
    body('swapId')
      .notEmpty()
      .withMessage('Swap ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .isLength({ max: 400 })
      .withMessage('Comment max 400 characters'),
  ],
  validate,
  createReview
)

// ─── DELETE /api/reviews/:id ─────────────────────────────────────────
// Delete own review (or admin can delete any review)
router.delete('/:id', protect, deleteReview)

export default router