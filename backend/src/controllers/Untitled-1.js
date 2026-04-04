// ─── sessions.routes.js ───────────────────────────────────────────────
import express from 'express'
import { body } from 'express-validator'
import {
  bookSession, getMySessions, getSessionById,
  confirmSession, startSession, completeSession,
  cancelSession, getUserAvailability, setAvailability,
} from '../controllers/session.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

export const sessionRouter = express.Router()
sessionRouter.use(protect)

sessionRouter.get('/my',                    getMySessions)
sessionRouter.get('/availability/:userId',  getUserAvailability)
sessionRouter.get('/:id',                   getSessionById)

sessionRouter.post(
  '/',
  [
    body('swapId').notEmpty().withMessage('Swap ID required'),
    body('title').trim().notEmpty().withMessage('Title required'),
    body('scheduledAt').isISO8601().withMessage('Valid date required'),
    body('format').optional().isIn(['video', 'audio', 'in_person', 'async']),
    body('durationMins').optional().isInt({ min: 15, max: 480 }),
  ],
  validate,
  bookSession
)

sessionRouter.put('/availability', setAvailability)
sessionRouter.patch('/:id/confirm',  confirmSession)
sessionRouter.patch('/:id/start',    startSession)
sessionRouter.patch('/:id/complete', completeSession)
sessionRouter.patch('/:id/cancel',   cancelSession)


// ─── endorsement.routes.js ────────────────────────────────────────────
import {
  createEndorsement, getUserEndorsements, deleteEndorsement,
  adminVerifySkill, getUserVerification, submitIdentityVerification,
  adminReviewIdentity,
} from '../controllers/endorsement.controller.js'
import { adminOnly } from '../middleware/auth.js'

export const endorsementRouter = express.Router()
endorsementRouter.use(protect)

endorsementRouter.get('/user/:userId',        getUserEndorsements)
endorsementRouter.get('/verification/:userId', getUserVerification)
endorsementRouter.post('/',                   createEndorsement)
endorsementRouter.post('/verify-identity',    submitIdentityVerification)
endorsementRouter.delete('/:id',              deleteEndorsement)

// Admin
endorsementRouter.post('/verify-skill',              adminOnly, adminVerifySkill)
endorsementRouter.patch('/verify-identity/:userId',  adminOnly, adminReviewIdentity)


// ─── dispute.routes.js ────────────────────────────────────────────────
import {
  createDispute, getMyDisputes, getDisputeById,
  addDisputeMessage, getAllDisputes, resolveDispute,
} from '../controllers/dispute.controller.js'

export const disputeRouter = express.Router()
disputeRouter.use(protect)

disputeRouter.get('/my',  getMyDisputes)
disputeRouter.get('/:id', getDisputeById)
disputeRouter.post(
  '/',
  [
    body('swapId').notEmpty(),
    body('type').isIn(['no_show','skill_mismatch','inappropriate','session_quality','cancellation','other']),
    body('title').trim().notEmpty(),
    body('description').trim().isLength({ min: 20 }).withMessage('Please describe the issue in at least 20 characters'),
  ],
  validate,
  createDispute
)
disputeRouter.post('/:id/message', [body('message').notEmpty()], validate, addDisputeMessage)

// Admin
disputeRouter.get('/',       adminOnly, getAllDisputes)
disputeRouter.patch('/:id/resolve', adminOnly, resolveDispute)


// ─── report.routes.js ─────────────────────────────────────────────────
import {
  reportUser, blockUser, unblockUser,
  getBlockedUsers, checkBlocked,
  getAllReports, reviewReport,
} from '../controllers/report.controller.js'

export const reportRouter = express.Router()
reportRouter.use(protect)

reportRouter.get('/blocked',             getBlockedUsers)
reportRouter.get('/is-blocked/:userId',  checkBlocked)
reportRouter.post('/',                   reportUser)
reportRouter.post('/block',              blockUser)
reportRouter.delete('/block/:userId',    unblockUser)

// Admin
reportRouter.get('/',         adminOnly, getAllReports)
reportRouter.patch('/:id/review', adminOnly, reviewReport)


// ─── post.routes.js ───────────────────────────────────────────────────
import {
  getFeed, createPost, getPostById,
  toggleLike, addComment, deleteComment,
  deletePost, hidePost,
} from '../controllers/post.controller.js'

export const postRouter = express.Router()

postRouter.get('/',    getFeed)
postRouter.get('/:id', getPostById)

postRouter.use(protect)
postRouter.post(
  '/',
  [body('content').trim().notEmpty().withMessage('Content required')],
  validate,
  createPost
)
postRouter.patch('/:id/like',                 toggleLike)
postRouter.post('/:id/comments',              [body('content').trim().notEmpty()], validate, addComment)
postRouter.delete('/:id/comments/:commentId', deleteComment)
postRouter.delete('/:id',                     deletePost)
postRouter.patch('/:id/hide', adminOnly,      hidePost)


// ─── notification.routes.js ───────────────────────────────────────────
import {
  getMyNotifications, markAsRead,
  markAllAsRead, deleteNotification,
} from '../controllers/notification.controller.js'

export const notificationRouter = express.Router()
notificationRouter.use(protect)

notificationRouter.get('/',           getMyNotifications)
notificationRouter.patch('/read-all', markAllAsRead)
notificationRouter.patch('/:id/read', markAsRead)
notificationRouter.delete('/:id',     deleteNotification)