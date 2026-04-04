import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Auth required'))
    try {
      socket.userId = jwt.verify(token, process.env.JWT_SECRET).id
      next()
    } catch { next(new Error('Invalid token')) }
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Connected: ${socket.userId}`)
    socket.join(`user:${socket.userId}`)

    socket.on('join_swap_room',  (id) => socket.join(`swap:${id}`))
    socket.on('leave_swap_room', (id) => socket.leave(`swap:${id}`))

    socket.on('send_message', ({ swapId, text }) => {
      io.to(`swap:${swapId}`).emit('receive_message', {
        senderId: socket.userId, text, timestamp: new Date()
      })
    })

    socket.on('typing_start', ({ swapId }) =>
      socket.to(`swap:${swapId}`).emit('user_typing', { userId: socket.userId }))
    socket.on('typing_stop', ({ swapId }) =>
      socket.to(`swap:${swapId}`).emit('user_stopped_typing', { userId: socket.userId }))

    socket.on('disconnect', () => console.log(`🔌 Disconnected: ${socket.userId}`))
  })

  return io
}

export const getIO = () => { if (!io) throw new Error('Socket not init'); return io }