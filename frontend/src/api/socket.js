import { io } from 'socket.io-client'
const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
let socket = null

export function connectSocket(token) {
  if (socket?.connected) return socket
  socket = io(URL, { auth: { token }, transports: ['websocket'], reconnection: true })
  socket.on('connect',       () => console.log('🔌 Socket connected'))
  socket.on('connect_error', (e) => console.error('Socket error:', e.message))
  return socket
}

export function disconnectSocket() { socket?.disconnect(); socket = null }
export const getSocket       = ()             => socket
export const joinSwapRoom    = (id)           => socket?.emit('join_swap_room',  id)
export const leaveSwapRoom   = (id)           => socket?.emit('leave_swap_room', id)
export const emitMessage     = (swapId, text) => socket?.emit('send_message',    { swapId, text })
export const typingStart     = (swapId)       => socket?.emit('typing_start',    { swapId })
export const typingStop      = (swapId)       => socket?.emit('typing_stop',     { swapId })
export const onMessage       = (cb)           => socket?.on('receive_message',       cb)
export const onTyping        = (cb)           => socket?.on('user_typing',            cb)
export const onStopTyping    = (cb)           => socket?.on('user_stopped_typing',    cb)
export const onNotification  = (cb)           => socket?.on('notification',           cb)
export const onSwapRequest   = (cb)           => socket?.on('swap_request',           cb)
export const onSwapStatus    = (cb)           => socket?.on('swap_status_update',     cb)
export const offMessage      = ()             => socket?.off('receive_message')
export const offTyping       = ()             => socket?.off('user_typing')
export const offNotification = ()             => socket?.off('notification')