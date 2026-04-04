import Endorsement from '../models/Endorsement.js'
import Verification from '../models/Verification.js'
import User from '../models/User.js'
import Skill from '../models/Skill.js'
import Swap from '../models/Swap.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { notify } from '../services/notification.service.js'
import { sendEndorsementEmail } from '../services/email.service.js'

// POST /api/endorsements — endorse a skill
export const createEndorsement = async (req, res, next) => {
  try {
    const { endorseeId, skillId, note, swapId } = req.body

    if (req.user._id.equals(endorseeId))
      return sendError(res, 'You cannot endorse yourself.', 400)

    const [endorsee, skill] = await Promise.all([
      User.findById(endorseeId),
      Skill.findById(skillId),
    ])
    if (!endorsee) return sendError(res, 'User not found.', 404)
    if (!skill)    return sendError(res, 'Skill not found.', 404)

    // Determine weight: swap partners get higher weight
    let weight = 'community'
    if (swapId) {
      const swap = await Swap.findOne({
        _id: swapId,
        status: 'completed',
        $or: [
          { requester: req.user._id, provider: endorseeId },
          { requester: endorseeId,   provider: req.user._id },
        ],
      })
      if (swap) weight = 'swap_partner'
    }

    const endorsement = await Endorsement.create({
      endorser: req.user._id,
      endorsee: endorseeId,
      skill:    skillId,
      note:     note || '',
      swap:     swapId || null,
      weight,
    })

    await endorsement.populate([
      { path: 'endorser', select: 'name avatar' },
      { path: 'skill',    select: 'name category' },
    ])

    // Notify + email endorsee
    await notify({
      recipientId: endorseeId,
      type: 'new_endorsement',
      title: 'New skill endorsement!',
      message: `${req.user.name} endorsed your ${skill.name} skill.`,
      link: '/settings',
      refModel: 'User',
      refId: req.user._id,
      emailFn: () => sendEndorsementEmail(endorsee, req.user, skill),
    })

    sendSuccess(res, 'Endorsement given!', endorsement, 201)
  } catch (err) {
    if (err.code === 11000) return sendError(res, 'You have already endorsed this skill.', 409)
    next(err)
  }
}

// GET /api/endorsements/user/:userId — all endorsements for a user
export const getUserEndorsements = async (req, res, next) => {
  try {
    const endorsements = await Endorsement.find({ endorsee: req.params.userId })
      .populate('endorser', 'name avatar')
      .populate('skill',    'name category level')
      .sort({ weight: -1, createdAt: -1 })

    // Group by skill for easier frontend rendering
    const bySkill = endorsements.reduce((acc, e) => {
      const key = e.skill._id.toString()
      if (!acc[key]) acc[key] = { skill: e.skill, count: 0, endorsers: [], weight: e.weight }
      acc[key].count++
      acc[key].endorsers.push({ name: e.endorser.name, avatar: e.endorser.avatar, weight: e.weight })
      return acc
    }, {})

    sendSuccess(res, 'Endorsements fetched.', {
      endorsements,
      bySkill: Object.values(bySkill).sort((a, b) => b.count - a.count),
      total: endorsements.length,
    })
  } catch (err) { next(err) }
}

// DELETE /api/endorsements/:id — withdraw an endorsement
export const deleteEndorsement = async (req, res, next) => {
  try {
    const endorsement = await Endorsement.findById(req.params.id)
    if (!endorsement) return sendError(res, 'Endorsement not found.', 404)
    if (!endorsement.endorser.equals(req.user._id))
      return sendError(res, 'Not authorized.', 403)

    await endorsement.deleteOne()
    sendSuccess(res, 'Endorsement withdrawn.')
  } catch (err) { next(err) }
}

// POST /api/endorsements/verify-skill — admin verifies a skill
export const adminVerifySkill = async (req, res, next) => {
  try {
    const { userId, skillId, method, certificateUrl } = req.body

    const verification = await Verification.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          verifiedSkills: {
            skill: skillId,
            verifiedBy: req.user._id,
            method,
            certificateUrl: certificateUrl || '',
          },
        },
      },
      { new: true, upsert: true }
    )

    // Recompute badge
    verification.badgeLevel = verification.computeBadge()
    await verification.save()

    sendSuccess(res, 'Skill verified.', verification)
  } catch (err) { next(err) }
}

// GET /api/endorsements/verification/:userId
export const getUserVerification = async (req, res, next) => {
  try {
    const verification = await Verification.findOne({ user: req.params.userId })
      .populate('verifiedSkills.skill', 'name category')

    sendSuccess(res, 'Verification fetched.', verification)
  } catch (err) { next(err) }
}

// POST /api/endorsements/verify-identity — user submits identity for verification
export const submitIdentityVerification = async (req, res, next) => {
  try {
    const { documentType, documentRef } = req.body

    const verification = await Verification.findOneAndUpdate(
      { user: req.user._id },
      {
        identityStatus:      'pending',
        identitySubmittedAt: new Date(),
        documentType,
        documentRef,
      },
      { new: true, upsert: true }
    )

    sendSuccess(res, 'Identity verification submitted. We will review within 48 hours.', verification)
  } catch (err) { next(err) }
}

// PATCH /api/endorsements/verify-identity/:userId — admin approves/rejects
export const adminReviewIdentity = async (req, res, next) => {
  try {
    const { status, reason } = req.body // status: 'verified' | 'rejected'

    const verification = await Verification.findOne({ user: req.params.userId })
    if (!verification) return sendError(res, 'Verification not found.', 404)

    verification.identityStatus = status
    if (status === 'verified') verification.identityVerifiedAt = new Date()
    if (status === 'rejected') verification.identityRejectedReason = reason || ''

    verification.badgeLevel = verification.computeBadge()
    await verification.save()

    const user = await User.findById(req.params.userId)
    if (status === 'verified') {
      const { sendVerificationApprovedEmail } = await import('../services/email.service.js')
      await notify({
        recipientId: req.params.userId,
        type: 'verification_approved',
        title: 'Identity verified! 🏅',
        message: 'Your identity has been verified. Your badge has been upgraded.',
        link: '/settings',
        emailFn: () => sendVerificationApprovedEmail(user),
      })
    }

    sendSuccess(res, `Identity ${status}.`, verification)
  } catch (err) { next(err) }
}