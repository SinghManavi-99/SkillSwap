import Session from '../models/session.js'
import Swap from '../models/Swap.js'
import Availability from '../models/Availability.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { notify } from '../services/notification.service.js'
import { sendSessionBookedEmail, sendSessionReminderEmail } from '../services/email.service.js'
import User from '../models/User.js'

// POST /api/sessions — book a session for an accepted swap
export const bookSession = async (req, res, next) => {
  try {
    const { swapId, title, description, scheduledAt, durationMins, format, meetingLink, location } = req.body

    const swap = await Swap.findById(swapId)
    if (!swap) return sendError(res, 'Swap not found.', 404)
    if (!['accepted', 'in_progress'].includes(swap.status))
      return sendError(res, 'Swap must be accepted before booking a session.', 400)

    const isParticipant = swap.requester.equals(req.user._id) || swap.provider.equals(req.user._id)
    if (!isParticipant) return sendError(res, 'Not authorized.', 403)

    // Check for time conflicts (same user booked at same time)
    const conflictStart = new Date(scheduledAt)
    const conflictEnd   = new Date(new Date(scheduledAt).getTime() + durationMins * 60000)

    const conflict = await Session.findOne({
      $or: [{ host: req.user._id }, { participant: req.user._id }],
      status: { $in: ['pending', 'confirmed'] },
      scheduledAt: {
        $lt: conflictEnd,
        $gte: new Date(conflictStart.getTime() - durationMins * 60000),
      },
    })
    if (conflict) return sendError(res, 'You already have a session booked at this time.', 409)

    const otherId = swap.requester.equals(req.user._id) ? swap.provider : swap.requester

    const session = await Session.create({
      swap: swapId,
      host: req.user._id,
      participant: otherId,
      title,
      description,
      scheduledAt,
      durationMins: durationMins || 60,
      format: format || 'video',
      meetingLink: meetingLink || '',
      location: location || '',
    })

    await session.populate([
      { path: 'host',        select: 'name email avatar' },
      { path: 'participant', select: 'name email avatar' },
      { path: 'swap',        select: 'skillOffered skillWanted' },
    ])

    // Notify the other party
    const other = await User.findById(otherId)
    await notify({
      recipientId: otherId,
      type: 'session_booked',
      title: 'New session booked!',
      message: `${req.user.name} booked a session: "${title}"`,
      link: '/swaps',
      refModel: 'Session',
      refId: session._id,
      emailFn: () => sendSessionBookedEmail(other, session, req.user),
    })

    sendSuccess(res, 'Session booked!', session, 201)
  } catch (err) { next(err) }
}

// GET /api/sessions/my — get all my sessions
export const getMySessions = async (req, res, next) => {
  try {
    const { status, upcoming } = req.query
    const query = {
      $or: [{ host: req.user._id }, { participant: req.user._id }],
    }
    if (status)   query.status = status
    if (upcoming) query.scheduledAt = { $gte: new Date() }

    const sessions = await Session.find(query)
      .populate('host',        'name avatar')
      .populate('participant', 'name avatar')
      .populate({ path: 'swap', populate: [{ path: 'skillOffered', select: 'name' }, { path: 'skillWanted', select: 'name' }] })
      .sort({ scheduledAt: 1 })

    sendSuccess(res, 'Sessions fetched.', sessions)
  } catch (err) { next(err) }
}

// GET /api/sessions/:id
export const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('host',        'name avatar email')
      .populate('participant', 'name avatar email')
      .populate({ path: 'swap', populate: [{ path: 'skillOffered' }, { path: 'skillWanted' }] })

    if (!session) return sendError(res, 'Session not found.', 404)

    const isParticipant = session.host.equals(req.user._id) || session.participant.equals(req.user._id)
    if (!isParticipant) return sendError(res, 'Not authorized.', 403)

    sendSuccess(res, 'Session fetched.', session)
  } catch (err) { next(err) }
}

// PATCH /api/sessions/:id/confirm — confirm attendance
export const confirmSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
    if (!session) return sendError(res, 'Session not found.', 404)

    if (session.host.equals(req.user._id))        session.hostConfirmed = true
    else if (session.participant.equals(req.user._id)) session.participantConfirmed = true
    else return sendError(res, 'Not authorized.', 403)

    if (session.hostConfirmed && session.participantConfirmed) {
      session.status = 'confirmed'
    }

    await session.save()
    sendSuccess(res, 'Session confirmed.', session)
  } catch (err) { next(err) }
}

// PATCH /api/sessions/:id/start — mark session as ongoing
export const startSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
    if (!session) return sendError(res, 'Session not found.', 404)
    if (!session.host.equals(req.user._id)) return sendError(res, 'Only host can start.', 403)

    session.status    = 'ongoing'
    session.startedAt = new Date()
    await session.save()
    sendSuccess(res, 'Session started.', session)
  } catch (err) { next(err) }
}

// PATCH /api/sessions/:id/complete — mark session as complete with notes
export const completeSession = async (req, res, next) => {
  try {
    const { notes } = req.body
    const session = await Session.findById(req.params.id)
    if (!session) return sendError(res, 'Session not found.', 404)

    const isHost = session.host.equals(req.user._id)
    const isParticipant = session.participant.equals(req.user._id)
    if (!isHost && !isParticipant) return sendError(res, 'Not authorized.', 403)

    if (isHost)        session.hostNotes        = notes || ''
    if (isParticipant) session.participantNotes = notes || ''

    // Both need to mark complete, or host alone is fine
    if (isHost) {
      session.status      = 'completed'
      session.completedAt = new Date()
    }

    await session.save()
    sendSuccess(res, 'Session completed.', session)
  } catch (err) { next(err) }
}

// PATCH /api/sessions/:id/cancel
export const cancelSession = async (req, res, next) => {
  try {
    const { reason } = req.body
    const session = await Session.findById(req.params.id)
    if (!session) return sendError(res, 'Session not found.', 404)

    const isParticipant = session.host.equals(req.user._id) || session.participant.equals(req.user._id)
    if (!isParticipant) return sendError(res, 'Not authorized.', 403)

    session.status             = 'cancelled'
    session.cancelledBy        = req.user._id
    session.cancellationReason = reason || ''
    session.cancelledAt        = new Date()
    await session.save()

    // Notify the other party
    const otherId = session.host.equals(req.user._id) ? session.participant : session.host
    await notify({
      recipientId: otherId,
      type: 'session_cancelled',
      title: 'Session cancelled',
      message: `${req.user.name} cancelled the session: "${session.title}"`,
      link: '/swaps',
      refModel: 'Session',
      refId: session._id,
    })

    sendSuccess(res, 'Session cancelled.', session)
  } catch (err) { next(err) }
}

// GET /api/sessions/availability/:userId — get user's available slots
export const getUserAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findOne({ user: req.params.userId })
    sendSuccess(res, 'Availability fetched.', availability)
  } catch (err) { next(err) }
}

// PUT /api/sessions/availability — set own availability
export const setAvailability = async (req, res, next) => {
  try {
    const { timezone, weeklySlots, blockedDates, maxSessionsPerWeek, bufferMins, isAcceptingRequests } = req.body

    const availability = await Availability.findOneAndUpdate(
      { user: req.user._id },
      { timezone, weeklySlots, blockedDates, maxSessionsPerWeek, bufferMins, isAcceptingRequests },
      { new: true, upsert: true, runValidators: true }
    )
    sendSuccess(res, 'Availability updated.', availability)
  } catch (err) { next(err) }
}