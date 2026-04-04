import express from 'express'
import { body } from 'express-validator'
import {
  getFeed,
  createPost,
  getPostById,
  toggleLike,
  addComment,
  deleteComment,
  deletePost,
  hidePost,
} from '../controllers/post.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// ─── GET /api/posts ──────────────────────────────────────────────────
// Get community feed posts (paginated)
// Query params:
//   type    — skill_share | swap_success | question | resource | milestone
//   search  — text search in content
//   skill   — filter by skill ObjectId
//   page    — page number (default 1)
//   limit   — posts per page (default 15)
// Public — no auth needed
router.get('/', getFeed)

// ─── GET /api/posts/:id ──────────────────────────────────────────────
// Get a single post with full comments
// Increments viewCount automatically
// Public — no auth needed
router.get('/:id', getPostById)

// All routes below require authentication
router.use(protect)

// ─── POST /api/posts ─────────────────────────────────────────────────
// Create a community post
// Body: { content, type?, mediaUrls[]?, skills[]?, relatedSwap? }
// Types: skill_share | swap_success | question | resource | milestone
router.post(
  '/',
  [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Post content is required')
      .isLength({ max: 2000 })
      .withMessage('Content max 2000 characters'),
    body('type')
      .optional()
      .isIn(['skill_share', 'swap_success', 'question', 'resource', 'milestone'])
      .withMessage('Invalid post type'),
    body('mediaUrls').optional().isArray().withMessage('mediaUrls must be an array'),
    body('skills').optional().isArray().withMessage('skills must be an array of IDs'),
  ],
  validate,
  createPost
)

// ─── PATCH /api/posts/:id/like ───────────────────────────────────────
// Toggle like/unlike on a post
// If already liked → removes like
// If not liked → adds like + notifies post author
router.patch('/:id/like', toggleLike)

// ─── POST /api/posts/:id/comments ────────────────────────────────────
// Add a comment to a post
// Notifies post author via Socket.io + notification
// Body: { content }
router.post(
  '/:id/comments',
  [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Comment content is required')
      .isLength({ max: 500 })
      .withMessage('Comment max 500 characters'),
  ],
  validate,
  addComment
)

// ─── DELETE /api/posts/:id/comments/:commentId ───────────────────────
// Delete a comment — allowed by:
//   - comment author
//   - post author
//   - admin
router.delete('/:id/comments/:commentId', deleteComment)

// ─── DELETE /api/posts/:id ───────────────────────────────────────────
// Delete a post — allowed by:
//   - post author
//   - admin
router.delete('/:id', deletePost)

// ─── PATCH /api/posts/:id/hide ───────────────────────────────────────
// Admin-only: hide a post from the feed (soft delete)
// Sets isHidden: true, hiddenBy, hiddenAt
router.patch('/:id/hide', adminOnly, hidePost)

export default router