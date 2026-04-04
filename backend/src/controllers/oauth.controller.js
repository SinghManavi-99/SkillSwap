import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { sendWelcomeEmail } from '../services/email.service.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// ─── Verify Google token & login/register ─────────────────────────────
// POST /api/auth/google
// Frontend sends: { credential } (the Google ID token from Google Sign-In button)
export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body
    if (!credential) return sendError(res, 'Google credential missing', 400)

    // 1. Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture, email_verified } = payload

    if (!email_verified) return sendError(res, 'Google email not verified', 400)

    // 2. Find existing user OR create new one
    let user = await User.findOne({
      $or: [{ googleId }, { email }]
    })

    let isNewUser = false

    if (!user) {
      // New user — register them
      isNewUser = true
      user = await User.create({
        name,
        email,
        googleId,
        avatar:   picture || '',
        password: `google_oauth_${googleId}_${Date.now()}`, // random — they won't use password
        provider: 'google',
        isEmailVerified: true, // Google already verified it
      })

      // Send welcome email to new users
      sendWelcomeEmail(user).catch(err =>
        console.error('[Welcome email error]', err.message)
      )
    } else {
      // Existing user — update googleId and avatar if missing
      if (!user.googleId) user.googleId = googleId
      if (!user.avatar && picture) user.avatar = picture
      if (!user.isEmailVerified) user.isEmailVerified = true
      await user.save()
    }

    if (!user.isActive) return sendError(res, 'Account has been deactivated', 403)

    // 3. Generate JWT
    const token = generateToken(user._id)

    sendSuccess(res, isNewUser ? 'Account created!' : 'Login successful!', {
      token,
      isNewUser,
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        avatar: user.avatar,
        role:   user.role,
        provider: 'google',
      },
    }, isNewUser ? 201 : 200)
  } catch (err) {
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token')) {
      return sendError(res, 'Google token expired or invalid. Please try again.', 401)
    }
    next(err)
  }
}

// ─── Unlink Google account ─────────────────────────────────────────────
// DELETE /api/auth/google/unlink
// User must have a password set before unlinking
export const unlinkGoogle = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password')

    // Can't unlink if Google is their only login method and no password
    if (user.provider === 'google' && !user.hasPassword) {
      return sendError(res, 'Set a password first before unlinking Google', 400)
    }

    user.googleId = undefined
    user.provider = 'local'
    await user.save()

    sendSuccess(res, 'Google account unlinked successfully')
  } catch (err) { next(err) }
}