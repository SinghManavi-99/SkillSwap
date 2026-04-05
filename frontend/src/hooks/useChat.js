import { useState, useEffect, useRef } from 'react'
import { chatApi, swapsApi } from '../api'
import {
  connectSocket, joinSwapRoom, leaveSwapRoom,
  emitMessage, typingStart, typingStop,
  onMessage, offMessage, onTyping, offTyping,
} from '../api/socket'
import { useAuth } from '../context/AuthContext'

export function useChat(swapId) {
  const { user }            = useAuth()
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState(null)
  const [otherTyping, setOtherTyping] = useState(false)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  // Load chat history from MongoDB on mount
  useEffect(() => {
    if (!swapId) return
    setLoading(true)
    chatApi.getHistory(swapId)
      .then(res => {
        setMessages(res.data)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [swapId])

  // Connect Socket.io and join swap room
  useEffect(() => {
    if (!swapId || !user?.token) return

    connectSocket(user.token)
    joinSwapRoom(swapId)

    // Listen for new messages from other user
    onMessage((msg) => {
      setMessages(prev => [...prev, msg])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })

    // Typing indicator
    onTyping(({ userId }) => {
      if (userId !== user.id) {
        setOtherTyping(true)
        clearTimeout(typingTimer.current)
        typingTimer.current = setTimeout(() => setOtherTyping(false), 2000)
      }
    })

    return () => {
      offMessage()
      offTyping()
      leaveSwapRoom(swapId)
      clearTimeout(typingTimer.current)
    }
  }, [swapId, user?.token])

  // Send message — saves to MongoDB + emits via Socket.io
  async function send(text) {
    if (!text.trim()) return
    setSending(true)
    try {
      // 1. Save to MongoDB via REST
      await swapsApi.sendMessage(swapId, text)
      // 2. Emit to other user via socket (real-time)
      emitMessage(swapId, text)
      // 3. Add to local state
      setMessages(prev => [...prev, {
        sender: { _id: user.id, name: user.name },
        text,
        sentAt: new Date(),
      }])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  // Typing indicator handlers
  function handleTypingStart() { typingStart(swapId) }
  function handleTypingStop()  { typingStop(swapId)  }

  return {
    messages, loading, sending, error,
    otherTyping, send, bottomRef,
    handleTypingStart, handleTypingStop,
  }
}