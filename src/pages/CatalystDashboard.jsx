import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { ACTIVE_SWAPS, MENTORS } from '../data/Mockdata'
import { useNavigate } from 'react-router-dom'

const INCOMING = [
  { id: 'i1', name: 'Tanya S.', initials: 'TS', color: 'lav',   theyTeach: 'Figma',    youTeach: 'React' },
  { id: 'i2', name: 'Karan M.', initials: 'KM', color: 'sky',   theyTeach: 'Spanish',  youTeach: 'Python' },
]
const OUTGOING = [
  { id: 'o1', name: 'Priya Sharma', initials: 'PS', color: 'mint',  theyTeach: 'DSA',    youTeach: 'Figma',   status: 'pending' },
  { id: 'o2', name: 'Sofia Reyes',  initials: 'SR', color: 'peach', theyTeach: 'Python', youTeach: 'Node.js', status: 'active'  },
]

export default function CatalystDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const taught = 18
  const learned = 14
  const totalHours = taught + learned
  const taughtPct = Math.round((taught / totalHours) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--surf)' }}>
      <Navbar />
      <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Welcome */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>Good morning, {firstName} ⚡</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>You have 2 incoming requests and 2 active swaps.</div>
          </div>
          <span className="pill pill-lem" style={{ fontSize: '11px' }}>Catalyst · Level 4</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '10px' }}>
          {[
            { label: 'Teaching',    val: `${taught}h`, color: 'var(--mint-600)' },
            { label: 'Learning',    val: `${learned}h`, color: 'var(--lav-600)' },
            { label: 'Active swaps', val: 4,           color: 'var(--peach-600)' },
            { label: 'XP earned',   val: '2,140',      color: 'var(--lem-600)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 500, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Swap exchange board */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '14px' }}>Swap exchange board</div>

            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--mint-600)', marginBottom: '8px' }}>Incoming</p>
            {INCOMING.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                border: '0.5px solid var(--lav-100)', borderRadius: '10px', padding: '8px 10px', marginBottom: '6px',
              }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                  background: `var(--${r.color}-50)`, color: `var(--${r.color}-600)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500,
                }}>{r.initials}</div>
                <div style={{ flex: 1, fontSize: '11px' }}>
                  <b>{r.name}</b> teaches <span className={`pill pill-${r.color}`} style={{ fontSize: '10px' }}>{r.theyTeach}</span>
                  {' '}↔ you teach <span className="pill pill-lav" style={{ fontSize: '10px' }}>{r.youTeach}</span>
                </div>
                <button className="btn-primary" style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '8px' }}>Accept</button>
              </div>
            ))}

            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--lav-600)', marginBottom: '8px', marginTop: '12px' }}>Outgoing</p>
            {OUTGOING.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                border: '0.5px solid var(--lav-100)', borderRadius: '10px', padding: '8px 10px', marginBottom: '6px',
              }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                  background: `var(--${r.color}-50)`, color: `var(--${r.color}-600)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500,
                }}>{r.initials}</div>
                <div style={{ flex: 1, fontSize: '11px' }}>
                  <b>{r.name}</b> teaches <span className={`pill pill-${r.color}`} style={{ fontSize: '10px' }}>{r.theyTeach}</span>
                  {' '}↔ you teach <span className="pill pill-lav" style={{ fontSize: '10px' }}>{r.youTeach}</span>
                </div>
                <span className={`pill ${r.status === 'active' ? 'pill-mint' : 'pill-lem'}`} style={{ fontSize: '10px' }}>{r.status}</span>
              </div>
            ))}
          </div>

          {/* Skill balance tracker */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '14px' }}>Skill balance tracker</div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--mint-600)', fontWeight: 500 }}>Teaching {taught}h</span>
                <span style={{ fontSize: '12px', color: 'var(--lav-600)', fontWeight: 500 }}>Learning {learned}h</span>
              </div>
              <div style={{ height: '10px', borderRadius: '5px', background: 'var(--lav-50)', overflow: 'hidden' }}>
                <div style={{ height: '10px', borderRadius: '5px', background: 'var(--mint-600)', width: `${taughtPct}%`, transition: 'width .5s' }} />
              </div>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
                You're teaching more than you're learning — consider adding more learning swaps!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ACTIVE_SWAPS.map(swap => (
                <div key={swap.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  border: '0.5px solid var(--lav-100)', borderRadius: '10px', padding: '8px 10px',
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: `var(--${swap.color}-50)`, color: `var(--${swap.color}-600)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500,
                  }}>{swap.mentorInitials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{swap.mentorName}</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>{swap.skill} · {swap.nextSession}</div>
                  </div>
                  <span className={`pill ${swap.status === 'active' ? 'pill-mint' : 'pill-lem'}`} style={{ fontSize: '10px' }}>{swap.status}</span>
                </div>
              ))}
            </div>

            <button className="btn-ghost" style={{ width: '100%', marginTop: '10px', fontSize: '12px' }}
              onClick={() => navigate('/explore')}>
              Find more learning swaps →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
