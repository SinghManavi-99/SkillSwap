import express from 'express'
import { getChatHistory } from '../controllers/chat.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All chat routes require authentication
router.use(protect)

// ─── GET /api/chat/:swapId ────────────────────────────────────────────
// Get full chat history for a swap (messages from MongoDB)
// Only swap participants can access
// Returns: array of messages with sender name + avatar populated
// NOTE: Real-time messages come via Socket.io (join_swap_room event)
//       This REST endpoint is for loading history on page load
router.get('/:swapId', getChatHistory)

export default router