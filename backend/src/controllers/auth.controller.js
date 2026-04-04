import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { sendWelcomeEmail } from '../services/email.service.js'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) return sendError(res, 'Email already registered', 409)
    const user  = await User.create({ name, email, password })
    const token = generateToken(user._id)
    sendWelcomeEmail(user).catch(() => {})
    sendSuccess(res, 'Registered!', { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 201)
  } catch (err) { next(err) }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) return sendError(res, 'Invalid email or password', 401)
    if (!user.isActive) return sendError(res, 'Account deactivated', 403)
    const token = generateToken(user._id)
    sendSuccess(res, 'Login successful!', { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } })
  } catch (err) { next(err) }
}

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body
    if (!credential) return sendError(res, 'Google credential missing', 400)
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })
    const { sub: googleId, email, name, picture, email_verified } = ticket.getPayload()
    if (!email_verified) return sendError(res, 'Google email not verified', 400)

    let user = await User.findOne({ $or: [{ googleId }, { email }] })
    let isNewUser = false

    if (!user) {
      isNewUser = true
      user = await User.create({ name, email, googleId, avatar: picture || '', password: `google_oauth_${googleId}`, provider: 'google', isEmailVerified: true })
      sendWelcomeEmail(user).catch(() => {})
    } else {
      if (!user.googleId) user.googleId = googleId
      if (!user.avatar && picture) user.avatar = picture
      await user.save()
    }

    if (!user.isActive) return sendError(res, 'Account deactivated', 403)
    const token = generateToken(user._id)
    sendSuccess(res, isNewUser ? 'Account created!' : 'Login successful!', {
      token, isNewUser, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    }, isNewUser ? 201 : 200)
  } catch (err) { next(err) }
}

export const getMe = (req, res) => sendSuccess(res, 'User fetched', req.user)
