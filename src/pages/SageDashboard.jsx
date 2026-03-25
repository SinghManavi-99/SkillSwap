import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { ACTIVE_SWAPS } from '../data/Mockdata'

const STUDENT_REQUESTS = [
  { id: 'r1', name: 'Riya Patel',  initials: 'RP', color: 'lav',  skill: 'React',       message: 'Hi! I\'d love to swap — I can teach Figma in return.', time: '2h ago' },
  { id: 'r2', name: 'Dev Sharma',  initials: 'DS', color: 'sky',  skill: 'Node.js',      message: 'Looking to learn APIs from scratch. I can offer Python basics.', time: '5h ago' },
  { id: 'r3', name: 'Ananya R.',   initials: 'AR', color: 'peach', skill: 'System design', message: 'Preparing for SDE interviews. I can teach Spanish.', time: 'Yesterday' },
]

const SESSIONS = [
  { id: 'ss1', student: 'Riya Patel', initials: 'RP', color: 'lav',  skill: 'React',   time: 'Today, 7:00 PM',  status: 'upcoming' },
  { id: 'ss2', student: 'Dev Sharma', initials: 'DS', color: 'sky',  skill: 'Node.js', time: 'Thu, 8:00 PM',   status: 'upcoming' },
  { id: 'ss3', student: 'Ananya R.', initials: 'AR',  color: 'peach', skill: 'DSA',    time: 'Sat, 6:00 PM',  status: 'upcoming' },
]

export default function SageDashboard() {
  const { user } = useAuth()
  const { profile } = useUser()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const [reqs, setReqs] = useState(STUDENT_REQUESTS)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--surf)' }}>
      <Navbar />
      <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Welcome */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>Good morning, {firstName} 🔥</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>
              You have {reqs.length} new swap requests and 3 upcoming sessions.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="pill pill-mint" style={{ fontSize: '11px' }}>Top Sage</span>
            <span style={{
              background: 'var(--lem-50)', border: '0.5px solid var(--lem-200)',
              borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, color: 'var(--lem-600)',
            }}>⭐ 4.9 rating</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '10px' }}>
          {[
            { label: 'Swaps done',    val: 87,    color: 'var(--lav-600)'   },
            { label: 'Hours taught',  val: '342h', color: 'var(--mint-600)' },
            { label: 'Avg rating',    val: '4.9', color: 'var(--lem-600)'   },
            { label: 'Credits earned', val: 520,  color: 'var(--peach-600)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 500, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Student requests */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '14px' }}>
              Student requests
              <span className="pill pill-peach" style={{ fontSize: '10px', marginLeft: '8px' }}>{reqs.length} new</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reqs.map(req => (
                <div key={req.id} style={{ border: '0.5px solid var(--lav-100)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: `var(--${req.color}-50)`, color: `var(--${req.color}-600)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 500,
                    }}>{req.initials}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500 }}>{req.name}</div>
                      <div style={{ fontSize: '10px', color: '#888' }}>Wants to learn: <b>{req.skill}</b></div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#aaa' }}>{req.time}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', lineHeight: 1.5 }}>{req.message}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-primary" style={{ flex: 1, fontSize: '11px', padding: '5px', borderRadius: '8px' }}
                      onClick={() => setReqs(p => p.filter(r => r.id !== req.id))}>
                      Accept
                    </button>
                    <button className="btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '5px', borderRadius: '8px' }}
                      onClick={() => setReqs(p => p.filter(r => r.id !== req.id))}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              {reqs.length === 0 && <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', padding: '12px' }}>No pending requests</p>}
            </div>
          </div>

          {/* Upcoming sessions */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '14px' }}>Upcoming sessions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SESSIONS.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  border: '0.5px solid var(--lav-100)', borderRadius: '12px', padding: '10px 12px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: `var(--${s.color}-50)`, color: `var(--${s.color}-600)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 500,
                  }}>{s.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{s.student}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{s.skill} · {s.time}</div>
                  </div>
                  <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px' }}>
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reputation */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '14px' }}>Reputation & credits</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '10px' }}>
            {[
              { label: 'Communication',  val: 4.9 },
              { label: 'Teaching clarity', val: 4.8 },
              { label: 'Punctuality',    val: 4.6 },
              { label: 'Would swap again', val: 4.9 },
            ].map(r => (
              <div key={r.label} style={{ background: 'var(--surf)', borderRadius: '10px', padding: '10px', border: '0.5px solid var(--lav-100)' }}>
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>{r.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--lav-600)' }}>{r.val}</div>
                <div style={{ height: '3px', borderRadius: '2px', background: 'var(--lav-100)', marginTop: '6px' }}>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'var(--lav-600)', width: `${(r.val / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
