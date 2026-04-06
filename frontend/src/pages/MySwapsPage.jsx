import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useMySwaps } from '../hooks/useSwaps'
import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks'

export default function MySwapsPage() {
  const { user } = useAuth()

  const {
    swaps,
    pending,
    active,
    completed,
    loading,
    accept,
    reject,
    complete,
    cancel
  } = useMySwaps()

  const [tab, setTab] = useState('all')
  const [cancelId, setCancelId] = useState(null)
  const [reason, setReason] = useState('')

  useScrollReveal()

  const displayed = {
    all: swaps,
    pending,
    active,
    completed
  }[tab]

  const statusStyle = {
    pending: 'badge-pending',
    accepted: 'badge-accepted',
    in_progress: 'badge-active',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    rejected: 'badge-rejected'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg3)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="text-2xl font-extrabold mb-6" style={{ color: 'var(--text)' }}>
          My Swaps
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            ['Pending', pending.length, 'var(--amber)'],
            ['Active', active.length, 'var(--purple)'],
            ['Done', completed.length, 'var(--green)']
          ].map(([label, value, color]) => (
            <div key={label} className="ss-card reveal p-4 text-center">
              <div className="text-2xl font-extrabold" style={{ color }}>
                {value}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'pending', 'active', 'completed'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all"
              style={{
                background: tab === t ? 'var(--purple)' : 'var(--card-bg)',
                color: tab === t ? '#fff' : 'var(--text3)',
                border: `1.5px solid ${
                  tab === t ? 'var(--purple)' : 'var(--border)'
                }`
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl animate-pulse"
                style={{ background: 'var(--border)' }}
              />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="ss-card reveal p-12 text-center">
            <p className="text-4xl mb-3">🔄</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text3)' }}>
              No swaps here yet.
            </p>
            <Link to="/explore">
              <button className="btn-primary px-6 py-2 text-sm">
                Find a match
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(swap => {
              const isReq = swap.requester?._id === user?._id
              const other = isReq ? swap.provider : swap.requester

              return (
                <div key={swap._id} className="ss-card reveal p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold"
                        style={{
                          background: 'var(--purple-light)',
                          color: 'var(--purple)'
                        }}
                      >
                        {other?.name?.[0] || '?'}
                      </div>

                      <div>
                        <p className="font-bold" style={{ color: 'var(--text)' }}>
                          {other?.name || 'User'}
                        </p>

                        <p className="text-sm" style={{ color: 'var(--text2)' }}>
                          {swap.skillOffered?.name}{' '}
                          <span style={{ color: 'var(--purple)' }}>⇄</span>{' '}
                          {swap.skillWanted?.name}
                        </p>

                        {swap.message && (
                          <p
                            className="text-xs mt-1 italic"
                            style={{ color: 'var(--text3)' }}
                          >
                            "{swap.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    <span className={statusStyle[swap.status] || 'badge-pending'}>
                      {swap.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 flex-wrap">

                    {/* 🔥 View Details */}
                    <Link
                      to={`/swaps/${swap._id}`}
                      className="text-xs px-4 py-2 rounded-xl"
                      style={{
                        background: 'var(--bg3)',
                        color: 'var(--text2)'
                      }}
                    >
                      View
                    </Link>

                    {!isReq && swap.status === 'pending' && (
                      <>
                        <button
                          onClick={() => accept(swap._id)}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          ✅ Accept
                        </button>

                        <button
                          onClick={() => reject(swap._id)}
                          className="text-xs px-4 py-2 rounded-xl"
                          style={{
                            background: '#FEE2E2',
                            color: '#991B1B'
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {isReq && ['pending', 'accepted'].includes(swap.status) && (
                      <button
                        onClick={() => setCancelId(swap._id)}
                        className="text-xs px-4 py-2 rounded-xl"
                        style={{
                          background: 'var(--bg3)',
                          color: 'var(--text2)'
                        }}
                      >
                        Cancel
                      </button>
                    )}

                    {['accepted', 'in_progress'].includes(swap.status) && (
                      <>
                        <button
                          onClick={() => complete(swap._id)}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          Mark Complete
                        </button>

                        <Link
                          to={`/messages/${swap._id}`}
                          className="text-xs px-4 py-2 rounded-xl"
                          style={{
                            background: 'var(--purple-light)',
                            color: 'var(--purple)'
                          }}
                        >
                          💬 Chat
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelId && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: 'var(--card-bg)' }}
          >
            <h3 className="font-bold mb-3" style={{ color: 'var(--text)' }}>
              Cancel Swap
            </h3>

            <textarea
              className="input-field resize-none mb-4"
              rows={3}
              placeholder="Reason (optional)..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="btn-outline flex-1 py-2.5 text-sm"
              >
                Keep it
              </button>

              <button
                onClick={() => {
                  cancel(cancelId, reason)
                  setCancelId(null)
                  setReason('')
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--red)' }}
              >
                Cancel Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}