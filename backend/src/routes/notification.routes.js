import express from 'express'
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All notification routes require authentication
router.use(protect)

// ─── GET /api/notifications ───────────────────────────────────────────
// Get my notifications (paginated, sorted newest first)
// Query params:
//   unreadOnly — 'true' to get only unread
//   page       — page number (default 1)
//   limit      — per page (default 20)
// Returns: { notifications[], unreadCount }
router.get('/', getMyNotifications)

// ─── PATCH /api/notifications/read-all ───────────────────────────────
// Mark ALL my notifications as read at once
// NOTE: must be before /:id so it's not caught by the param route
router.patch('/read-all', markAllAsRead)

// ─── PATCH /api/notifications/:id/read ───────────────────────────────
// Mark a single notification as read
// Sets isRead: true + readAt timestamp
router.patch('/:id/read', markAsRead)

// ─── DELETE /api/notifications/:id ───────────────────────────────────
// Permanently delete a single notification
router.delete('/:id', deleteNotification)

export default router