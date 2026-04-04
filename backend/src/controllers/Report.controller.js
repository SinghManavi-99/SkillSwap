import { Report, Block } from '../models/Report.js'
import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/response.js'

// POST /api/reports — report a user
export const reportUser = async (req, res, next) => {
  try {
    const { reportedId, reason, description, evidence } = req.body

    if (req.user._id.equals(reportedId))
      return sendError(res, 'You cannot report yourself.', 400)

    const reported = await User.findById(reportedId)
    if (!reported) return sendError(res, 'User not found.', 404)

    const report = await Report.create({
      reporter:    req.user._id,
      reported:    reportedId,
      reason,
      description: description || '',
      evidence:    evidence    || [],
    })

    sendSuccess(res, 'Report submitted. Our team will review it.', { reportId: report._id }, 201)
  } catch (err) {
    if (err.code === 11000) return sendError(res, 'You have already reported this user.', 409)
    next(err)
  }
}

// POST /api/reports/block — block a user
export const blockUser = async (req, res, next) => {
  try {
    const { blockId } = req.body

    if (req.user._id.equals(blockId))
      return sendError(res, 'You cannot block yourself.', 400)

    await Block.create({ blocker: req.user._id, blocked: blockId })
    sendSuccess(res, 'User blocked successfully.')
  } catch (err) {
    if (err.code === 11000) return sendError(res, 'You have already blocked this user.', 409)
    next(err)
  }
}

// DELETE /api/reports/block/:userId — unblock a user
export const unblockUser = async (req, res, next) => {
  try {
    await Block.findOneAndDelete({ blocker: req.user._id, blocked: req.params.userId })
    sendSuccess(res, 'User unblocked.')
  } catch (err) { next(err) }
}

// GET /api/reports/blocked — get my blocked users
export const getBlockedUsers = async (req, res, next) => {
  try {
    const blocks = await Block.find({ blocker: req.user._id })
      .populate('blocked', 'name avatar email')

    sendSuccess(res, 'Blocked users fetched.', blocks)
  } catch (err) { next(err) }
}

// GET /api/reports/is-blocked/:userId — check if a user is blocked
export const checkBlocked = async (req, res, next) => {
  try {
    const block = await Block.findOne({
      $or: [
        { blocker: req.user._id, blocked: req.params.userId },
        { blocker: req.params.userId, blocked: req.user._id },
      ],
    })
    sendSuccess(res, 'Block status fetched.', { isBlocked: !!block })
  } catch (err) { next(err) }
}

// ── Admin only ────────────────────────────────────────────────────────

// GET /api/reports — admin: all reports
export const getAllReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const query = {}
    if (status) query.status = status

    const reports = await Report.find(query)
      .populate('reporter', 'name email avatar')
      .populate('reported', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Report.countDocuments(query)
    sendSuccess(res, 'Reports fetched.', { reports, total })
  } catch (err) { next(err) }
}

// PATCH /api/reports/:id/review — admin reviews a report
export const reviewReport = async (req, res, next) => {
  try {
    const { status, note } = req.body

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedBy: req.user._id,
        reviewNote: note || '',
        reviewedAt: new Date(),
      },
      { new: true }
    )
    if (!report) return sendError(res, 'Report not found.', 404)

    sendSuccess(res, 'Report reviewed.', report)
  } catch (err) { next(err) }
}