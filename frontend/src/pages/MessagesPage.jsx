import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useChat } from '../hooks/useSwaps'
import { useAuth } from '../context/AuthContext'

export default function MessagesPage() {
  const { id: swapId } = useParams()
  const { user } = useAuth()

  const {
    messages,
    loading,
    sending,
    send,
    bottomRef,
    otherTyping,
    onTypingStart,
    onTypingStop
  } = useChat(swapId)

  const [text, setText] = useState('')

  if (!swapId) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <p className="text-center py-20" style={{ color: 'var(--text3)' }}>
          Select a swap to chat
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg3)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Navbar />

      <div
        style={{
          flex: 1,
          maxWidth: '720px',
          margin: '0 auto',
          width: '100%',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          className="ss-card flex-1 flex flex-col overflow-hidden"
          style={{ minHeight: '500px' }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center gap-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}
            >
              💬
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                Swap Chat
              </p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>
                Messages saved in database
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {loading ? (
              <p className="text-center text-sm py-8" style={{ color: 'var(--text3)' }}>
                Loading messages...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm py-8" style={{ color: 'var(--text3)' }}>
                No messages yet. Say hi! 👋
              </p>
            ) : (
              messages.map((msg, i) => {
                const isMe =
                  msg.sender?._id === user?._id ||
                  msg.senderId === user?._id

                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '72%',
                        padding: '10px 14px',
                        borderRadius: isMe
                          ? '18px 18px 4px 18px'
                          : '18px 18px 18px 4px',
                        background: isMe ? 'var(--purple)' : 'var(--bg3)',
                        color: isMe ? '#fff' : 'var(--text)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <p>{msg.text}</p>

                      <p
                        style={{
                          fontSize: '0.65rem',
                          marginTop: '4px',
                          opacity: 0.7
                        }}
                      >
                        {new Date(
                          msg.sentAt || msg.timestamp
                        ).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}

            {/* Typing Indicator */}
            {otherTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '18px',
                    background: 'var(--bg3)',
                    color: 'var(--text3)',
                    fontSize: '0.8rem'
                  }}
                >
                  typing…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={e => {
              e.preventDefault()
              if (!text.trim()) return

              send(text)
              setText('')
            }}
            style={{
              display: 'flex',
              gap: '10px',
              padding: '1rem',
              borderTop: '1px solid var(--border)'
            }}
          >
            <input
              className="input-field flex-1 text-sm"
              placeholder="Type a message..."
              value={text}
              disabled={sending}
              onChange={e => setText(e.target.value)}
              onFocus={onTypingStart}
              onBlur={onTypingStop}
            />

            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="btn-primary text-sm px-5 py-2.5"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
