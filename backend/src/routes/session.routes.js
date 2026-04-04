import express from 'express'
import { body } from 'express-validator'
import {
  bookSession,
  getMySessions,
  getSessionById,
  confirmSession,
  startSession,
  completeSession,
  cancelSession,
  getUserAvailability,
  setAvailability,
} from '../controllers/session.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// All session routes require authentication
router.use(protect)

// ─── GET /api/sessions/my ────────────────────────────────────────────
// Get all my sessions (as host or participant)
// Query params:
//   status   — filter by session status
//   upcoming — 'true' to show only future sessions
// NOTE: must be before /:id
router.get('/my', getMySessions)

// ─── GET /api/sessions/availability/:userId ──────────────────────────
// Get a user's weekly availability slots + blocked dates
// Used to show available time slots before booking
// NOTE: must be before /:id
router.get('/availability/:userId', getUserAvailability)

// ─── GET /api/sessions/:id ───────────────────────────────────────────
// Get a single session with full details
// Only host and participant can access
router.get('/:id', getSessionById)

// ─── POST /api/sessions ──────────────────────────────────────────────
// Book a new session for an accepted swap
// Checks for scheduling conflicts (double-booking prevention)
// Notifies other party via Socket.io + email
// Body: {
//   swapId, title, description?,
//   scheduledAt (ISO8601), durationMins?,
//   format (video|audio|in_person), meetingLink?, location?
// }
router.post(
  '/',
  [
    body('swapId')
      .notEmpty()
      .withMessage('Swap ID is required'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Session title is required')
      .isLength({ max: 100 })
      .withMessage('Title max 100 characters'),
    body('scheduledAt')
      .isISO8601()
      .withMessage('scheduledAt must be a valid ISO date'),
    body('durationMins')
      .optional()
      .isInt({ min: 15, max: 480 })
      .withMessage('Duration must be between 15 and 480 minutes'),
    body('format')
      .optional()
      .isIn(['video', 'audio', 'in_person'])
      .withMessage('Format must be video, audio, or in_person'),
  ],
  validate,
  bookSession
)

// ─── PUT /api/sessions/availability ──────────────────────────────────
// Set own weekly availability (creates or updates)
// Body: {
//   timezone, weeklySlots[{ day, startTime, endTime }],
//   blockedDates[], maxSessionsPerWeek?, bufferMins?,
//   isAcceptingRequests?
// }
router.put('/availability', setAvailability)

// ─── PATCH /api/sessions/:id/confirm ─────────────────────────────────
// Confirm attendance for a session
// Both host AND participant must confirm → status becomes 'confirmed'
router.patch('/:id/confirm', confirmSession)

// ─── PATCH /api/sessions/:id/start ───────────────────────────────────
// Mark session as started/ongoing (host only)
// Sets status: 'ongoing', startedAt: now
router.patch('/:id/start', startSession)

// ─── PATCH /api/sessions/:id/complete ────────────────────────────────
// Mark session as completed + add session notes
// Body: { notes? }
router.patch(
  '/:id/complete',
  [
    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes max 1000 characters'),
  ],
  validate,
  completeSession
)

// ─── PATCH /api/sessions/:id/cancel ──────────────────────────────────
// Cancel a session (host or participant)
// Notifies the other party via Socket.io
// Body: { reason? }
router.patch(
  '/:id/cancel',
  [
    body('reason')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Reason max 500 characters'),
  ],
  validate,
  cancelSession
)

export default router