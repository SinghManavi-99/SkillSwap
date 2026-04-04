import Notification from '../models/Notification.js'
import { sendSuccess } from '../utils/response.js'

export const getMyNotifications = async (req, res, next) => {
  try {
    const { unreadOnly, page = 1, limit = 20 } = req.query
    const query = { recipient: req.user._id }
    if (unreadOnly === 'true') query.isRead = false
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false })
    sendSuccess(res, 'Notifications fetched', { notifications, unreadCount })
  } catch (err) { next(err) }
}

export const markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true, readAt: new Date() })
    sendSuccess(res, 'Marked as read')
  } catch (err) { next(err) }
}

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: new Date() })
    sendSuccess(res, 'All marked as read')
  } catch (err) { next(err) }
}

export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id })
    sendSuccess(res, 'Notification deleted')
  } catch (err) { next(err) }
}