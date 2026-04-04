import Swap from '../models/Swap.js'
import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { notify } from '../services/notification.service.js'
import { sendSwapRequestEmail, sendSwapAcceptedEmail, sendSwapCompletedEmail } from '../services/email.service.js'

const populate = [
  { path: 'requester', select: 'name avatar' },
  { path: 'provider',  select: 'name avatar' },
  { path: 'skillOffered', select: 'name category' },
  { path: 'skillWanted',  select: 'name category' },
]

export const createSwap = async (req, res, next) => {
  try {
    const { providerId, skillOfferedId, skillWantedId, message, sessionFormat } = req.body
    if (req.user._id.equals(providerId)) return sendError(res, 'Cannot swap with yourself', 400)
    const provider = await User.findById(providerId)
    if (!provider || !provider.isActive) return sendError(res, 'Provider not found', 404)
    const dup = await Swap.findOne({ requester: req.user._id, provider: providerId, skillOffered: skillOfferedId, skillWanted: skillWantedId, status: { $in: ['pending','accepted','in_progress'] } })
    if (dup) return sendError(res, 'Swap already exists for these skills', 409)
    const swap = await Swap.create({ requester: req.user._id, provider: providerId, skillOffered: skillOfferedId, skillWanted: skillWantedId, message, sessionFormat })
    await swap.populate(populate)
    await notify({ recipientId: providerId, type: 'swap_request', title: 'New swap request!', message: `${req.user.name} wants to swap skills with you.`, link: '/swaps', refModel: 'Swap', refId: swap._id, emailFn: () => sendSwapRequestEmail(provider, req.user, swap) })
    sendSuccess(res, 'Swap request sent!', swap, 201)
  } catch (err) { next(err) }
}

export const getMySwaps = async (req, res, next) => {
  try {
    const { status, role } = req.query
    const query = {}
    if (role === 'requester') query.requester = req.user._id
    else if (role === 'provider') query.provider = req.user._id
    else query.$or = [{ requester: req.user._id }, { provider: req.user._id }]
    if (status) query.status = status
    const swaps = await Swap.find(query).populate(populate).sort({ updatedAt: -1 })
    sendSuccess(res, 'Swaps fetched', swaps)
  } catch (err) { next(err) }
}

export const getSwapById = async (req, res, next) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('requester', 'name avatar bio reputationScore')
      .populate('provider',  'name avatar bio reputationScore')
      .populate('skillOffered', 'name category level')
      .populate('skillWanted',  'name category level')
      .populate('messages.sender', 'name avatar')
    if (!swap) return sendError(res, 'Swap not found', 404)
    const isParty = swap.requester._id.equals(req.user._id) || swap.provider._id.equals(req.user._id)
    if (!isParty) return sendError(res, 'Not authorized', 403)
    sendSuccess(res, 'Swap fetched', swap)
  } catch (err) { next(err) }
}

export const updateSwapStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason, scheduledAt } = req.body
    const swap = await Swap.findById(req.params.id)
    if (!swap) return sendError(res, 'Swap not found', 404)
    const isRequester = swap.requester.equals(req.user._id)
    const isProvider  = swap.provider.equals(req.user._id)
    if (!isRequester && !isProvider) return sendError(res, 'Not authorized', 403)

    const allowed = { pending: ['accepted','rejected','cancelled'], accepted: ['in_progress','cancelled'], in_progress: ['completed','cancelled'] }
    if (!allowed[swap.status]?.includes(status)) return sendError(res, `Cannot transition from '${swap.status}' to '${status}'`, 400)
    if (['accepted','rejected'].includes(status) && !isProvider) return sendError(res, 'Only provider can accept/reject', 403)

    swap.status = status
    if (cancellationReason) swap.cancellationReason = cancellationReason
    if (scheduledAt) swap.scheduledAt = scheduledAt
    if (['cancelled','rejected'].includes(status)) swap.cancelledBy = req.user._id
    if (status === 'completed') swap.completedAt = new Date()
    await swap.save()

    const otherId = isRequester ? swap.provider : swap.requester
    const other = await User.findById(otherId)

    if (status === 'accepted') {
      await notify({ recipientId: isProvider ? swap.requester : swap.provider, type: 'swap_accepted', title: 'Swap accepted! 🎉', message: `Your swap request was accepted.`, link: '/swaps', emailFn: () => sendSwapAcceptedEmail(other, req.user) })
    }
    if (status === 'completed') {
      for (const uid of [swap.requester, swap.provider]) {
        const u = await User.findById(uid)
        await notify({ recipientId: uid, type: 'swap_completed', title: 'Swap completed! 🏆', message: 'Leave a review for your partner.', link: '/swaps', emailFn: () => sendSwapCompletedEmail(u) })
      }
    }

    sendSuccess(res, `Swap ${status}`, swap)
  } catch (err) { next(err) }
}

export const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body
    const swap = await Swap.findById(req.params.id)
    if (!swap) return sendError(res, 'Swap not found', 404)
    const isParty = swap.requester.equals(req.user._id) || swap.provider.equals(req.user._id)
    if (!isParty) return sendError(res, 'Not authorized', 403)
    if (!['accepted','in_progress'].includes(swap.status)) return sendError(res, 'Can only chat in active swaps', 400)
    swap.messages.push({ sender: req.user._id, text })
    await swap.save()
    const msg = swap.messages[swap.messages.length - 1]
    sendSuccess(res, 'Message sent', msg, 201)
  } catch (err) { next(err) }
}