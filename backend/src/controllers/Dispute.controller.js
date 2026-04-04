import Dispute from '../models/Dispute.js'
import Swap from '../models/Swap.js'
import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { notify } from '../services/notification.service.js'
import { sendDisputeUpdateEmail } from '../services/email.service.js'

// POST /api/disputes — raise a dispute
export const createDispute = async (req, res, next) => {
  try {
    const { swapId, type, title, description, evidence } = req.body

    const swap = await Swap.findById(swapId)
    if (!swap) return sendError(res, 'Swap not found.', 404)

    const isParticipant = swap.requester.equals(req.user._id) || swap.provider.equals(req.user._id)
    if (!isParticipant) return sendError(res, 'Not authorized.', 403)

    // Check for existing open dispute on this swap
    const existing = await Dispute.findOne({ swap: swapId, raisedBy: req.user._id, status: { $in: ['open', 'under_review'] } })
    if (existing) return sendError(res, 'You already have an open dispute for this swap.', 409)

    const againstId = swap.requester.equals(req.user._id) ? swap.provider : swap.requester

    const dispute = await Dispute.create({
      swap:        swapId,
      raisedBy:    req.user._id,
      against:     againstId,
      type,
      title,
      description,
      evidence:    evidence || [],
      priority:    type === 'harassment' || type === 'inappropriate' ? 'high' : 'medium',
    })

    await dispute.populate([
      { path: 'raisedBy', select: 'name avatar' },
      { path: 'against',  select: 'name avatar' },
    ])

    // Notify the other party and admins
    await notify({
      recipientId: againstId,
      type: 'dispute_update',
      title: 'A dispute has been raised',
      message: `${req.user.name} raised a dispute regarding your swap. Our team will review it.`,
      link: '/swaps',
      refModel: 'Dispute',
      refId: dispute._id,
    })

    sendSuccess(res, 'Dispute raised. Our team will review within 48 hours.', dispute, 201)
  } catch (err) { next(err) }
}

// GET /api/disputes/my — get my disputes
export const getMyDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({
      $or: [{ raisedBy: req.user._id }, { against: req.user._id }],
    })
      .populate('raisedBy', 'name avatar')
      .populate('against',  'name avatar')
      .populate({ path: 'swap', select: 'skillOffered skillWanted', populate: [{ path: 'skillOffered', select: 'name' }, { path: 'skillWanted', select: 'name' }] })
      .sort({ createdAt: -1 })

    sendSuccess(res, 'Disputes fetched.', disputes)
  } catch (err) { next(err) }
}

// GET /api/disputes/:id
export const getDisputeById = async (req, res, next) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('raisedBy',   'name avatar')
      .populate('against',    'name avatar')
      .populate('resolvedBy', 'name')
      .populate('thread.sender', 'name avatar')
      .populate({ path: 'swap', populate: [{ path: 'skillOffered', select: 'name' }, { path: 'skillWanted', select: 'name' }] })

    if (!dispute) return sendError(res, 'Dispute not found.', 404)

    const isParty = dispute.raisedBy._id.equals(req.user._id) || dispute.against._id.equals(req.user._id)
    const isAdmin = req.user.role === 'admin'
    if (!isParty && !isAdmin) return sendError(res, 'Not authorized.', 403)

    sendSuccess(res, 'Dispute fetched.', dispute)
  } catch (err) { next(err) }
}

// POST /api/disputes/:id/message — add a message to dispute thread
export const addDisputeMessage = async (req, res, next) => {
  try {
    const { message } = req.body
    const dispute = await Dispute.findById(req.params.id)
    if (!dispute) return sendError(res, 'Dispute not found.', 404)

    const isParty = dispute.raisedBy.equals(req.user._id) || dispute.against.equals(req.user._id)
    const isAdmin = req.user.role === 'admin'
    if (!isParty && !isAdmin) return sendError(res, 'Not authorized.', 403)

    dispute.thread.push({
      sender:  req.user._id,
      message,
      isAdmin,
    })
    await dispute.save()

    // Notify other party
    const otherId = dispute.raisedBy.equals(req.user._id) ? dispute.against : dispute.raisedBy
    await notify({
      recipientId: otherId,
      type: 'dispute_update',
      title: 'New message in your dispute',
      message: `${req.user.name} sent a message in dispute #${dispute._id.toString().slice(-6)}`,
      link: '/swaps',
      refModel: 'Dispute',
      refId: dispute._id,
    })

    sendSuccess(res, 'Message added.', dispute.thread)
  } catch (err) { next(err) }
}

// ── Admin only ────────────────────────────────────────────────────────

// GET /api/disputes — admin: all disputes
export const getAllDisputes = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query
    const query = {}
    if (status)   query.status   = status
    if (priority) query.priority = priority

    const disputes = await Dispute.find(query)
      .populate('raisedBy', 'name avatar')
      .populate('against',  'name avatar')
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Dispute.countDocuments(query)
    sendSuccess(res, 'Disputes fetched.', { disputes, total })
  } catch (err) { next(err) }
}

// PATCH /api/disputes/:id/resolve — admin resolves dispute
export const resolveDispute = async (req, res, next) => {
  try {
    const { status, resolution, outcome } = req.body

    const dispute = await Dispute.findById(req.params.id)
    if (!dispute) return sendError(res, 'Dispute not found.', 404)

    dispute.status     = status     // 'resolved' | 'dismissed'
    dispute.resolution = resolution
    dispute.outcome    = outcome    // 'warning_issued' | 'swap_cancelled' | 'user_suspended' | 'no_action'
    dispute.resolvedBy = req.user._id
    dispute.resolvedAt = new Date()

    await dispute.save()

    // Notify both parties
    const [raisedByUser, againstUser] = await Promise.all([
      User.findById(dispute.raisedBy),
      User.findById(dispute.against),
    ])

    for (const user of [raisedByUser, againstUser]) {
      await notify({
        recipientId: user._id,
        type: 'dispute_update',
        title: `Dispute ${status}`,
        message: `Your dispute has been ${status}. ${resolution}`,
        link: '/swaps',
        refModel: 'Dispute',
        refId: dispute._id,
        emailFn: () => sendDisputeUpdateEmail(user, dispute),
      })
    }

    // If outcome is swap_cancelled, actually cancel the swap
    if (outcome === 'swap_cancelled') {
      await Swap.findByIdAndUpdate(dispute.swap, {
        status: 'cancelled',
        cancellationReason: `Admin action: ${resolution}`,
        cancelledBy: req.user._id,
      })
    }

    sendSuccess(res, 'Dispute resolved.', dispute)
  } catch (err) { next(err) }
}