import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'
import { sendError } from '../utils/response.js'

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return sendError(res, 'Token missing', 401)
    const decoded = verifyToken(auth.split(' ')[1])
    const user = await User.findById(decoded.id).select('-password')
    if (!user || !user.isActive) return sendError(res, 'User not found', 401)
    req.user = user
    next()
  } catch { sendError(res, 'Invalid token', 401) }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return sendError(res, 'Admin only', 403)
  next()
}