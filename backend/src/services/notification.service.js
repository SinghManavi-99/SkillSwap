import Notification from '../models/Notification.js'

let _io = null
export const setIO = (io) => { _io = io }

export async function notify({ recipientId, type, title, message, link='', refModel='', refId=null, emailFn=null }) {
  try {
    const notification = await Notification.create({
      recipient: recipientId, type, title, message, link, refModel, refId
    })

    if (_io) {
      _io.to(`user:${recipientId}`).emit('notification', {
        id: notification._id, type, title, message, link,
        createdAt: notification.createdAt
      })
    }

    if (emailFn) {
      await emailFn().catch(err => console.error('[Email]', err.message))
    }

    return notification
  } catch (err) {
    console.error('[Notify error]', err.message)
  }
}