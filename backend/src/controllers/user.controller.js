import User from '../models/User.js'
import Skill from '../models/Skill.js'
import { findMatches } from '../utils/matching.js'
import { sendSuccess, sendError } from '../utils/response.js'


// ─── GET CURRENT USER PROFILE ─────────────────────────────────────────
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('skillsOffered', 'name category level')
      .populate('skillsWanted', 'name category level')

    sendSuccess(res, 'Profile fetched', user)
  } catch (err) {
    next(err)
  }
}


// ─── GET ALL USERS ────────────────────────────────────────────────────
export const getAllUsers = async (req, res, next) => {
  try {
    const { location, page = 1, limit = 12 } = req.query

    const query = {
      isActive: true,
      _id: { $ne: req.user._id }
    }

    if (location) {
      query['location.city'] = new RegExp(location, 'i')
    }

    const users = await User.find(query)
      .select('-password')
      .populate('skillsOffered', 'name category level')
      .populate('skillsWanted', 'name category level')
      .sort({ reputationScore: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    const total = await User.countDocuments(query)

    sendSuccess(res, 'Users fetched', {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    next(err)
  }
}


// ─── GET USER BY ID ───────────────────────────────────────────────────
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('skillsOffered', 'name category level description')
      .populate('skillsWanted', 'name category level description')

    if (!user || !user.isActive) {
      return sendError(res, 'User not found', 404)
    }

    sendSuccess(res, 'User fetched', user)
  } catch (err) {
    next(err)
  }
}


// ─── UPDATE PROFILE ───────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, avatar } = req.body

    const updates = {}

    if (name !== undefined) updates.name = name
    if (bio !== undefined) updates.bio = bio
    if (location !== undefined) updates.location = location
    if (avatar !== undefined) updates.avatar = avatar

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password')

    sendSuccess(res, 'Profile updated', updated)
  } catch (err) {
    next(err)
  }
}


// ─── UPDATE SKILLS ────────────────────────────────────────────────────
export const updateSkills = async (req, res, next) => {
  try {
    const { skillsOffered, skillsWanted } = req.body

    if (skillsOffered && !Array.isArray(skillsOffered)) {
      return sendError(res, 'skillsOffered must be an array', 400)
    }

    if (skillsWanted && !Array.isArray(skillsWanted)) {
      return sendError(res, 'skillsWanted must be an array', 400)
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { skillsOffered, skillsWanted },
      { new: true }
    )
      .select('-password')
      .populate('skillsOffered', 'name category level')
      .populate('skillsWanted', 'name category level')

    sendSuccess(res, 'Skills updated', updated)
  } catch (err) {
    next(err)
  }
}


// ─── GET MATCHES ──────────────────────────────────────────────────────
export const getMatches = async (req, res, next) => {
  try {
    const matches = await findMatches(req.user._id)
    sendSuccess(res, 'Matches fetched', matches)
  } catch (err) {
    next(err)
  }
}


// ─── DEACTIVATE ACCOUNT ───────────────────────────────────────────────
export const deactivateAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false })
    sendSuccess(res, 'Account deactivated')
  } catch (err) {
    next(err)
  }
}