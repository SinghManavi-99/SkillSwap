import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ACTIVE_SWAPS } from '../data/Mockdata'

const TABS = ['All', 'Active', 'Pending', 'Completed']

export default function MySwapsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('All')

  const swaps = [
    ...ACTIVE_SWAPS,
    { id: 's4', mentorId:'m4', mentorName:'Kabir Nair', mentorInitials:'KN', color:'sky', skill:'Machine learning', status:'completed', nextSession:'Done', sessionsLeft:0 },
  ]

  const filtered = tab === 'All' ? swaps : swaps.filter(s => s.status === tab.toLowerCase())

  const STATUS_STYLE = {
    active:    { bg:'var(--mint-50)',  text:'var(--mint-600)'  },
    pending:   { bg:'var(--lem-50)',   text:'var(--lem-600)'   },
    completed: { bg:'var(--lav-50)',   text:'var(--lav-600)'   },
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--surf)' }}>
      <Navbar />
      <div style={{ padding:'20px 24px 40px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:500, marginBottom:'4px' }}>My swaps</h1>
        <p style={{ fontSize:'13px', color:'#888', marginBottom:'20px' }}>Track all your active, pending, and completed skill swaps.</p>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', marginBottom:'20px' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:'6px 16px', borderRadius:'20px', fontSize:'13px', border:'none', cursor:'pointer',
              background: tab === t ? 'var(--lav-600)' : 'var(--lav-50)',
              color: tab === t ? '#fff' : 'var(--lav-600)',
              fontWeight: tab === t ? 500 : 400, transition:'all .15s',
            }}>{t}</button>
          ))}
        </div>

        {/* Swap cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {filtered.map(swap => {
            const ss = STATUS_STYLE[swap.status] || STATUS_STYLE.active
            return (
              <div key={swap.id} className="card" style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{
                  width:'48px', height:'48px', borderRadius:'50%', flexShrink:0,
                  background:`var(--${swap.color}-50)`, color:`var(--${swap.color}-600)`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:500,
                  border:`1.5px solid var(--${swap.color}-200)`,
                }}>{swap.mentorInitials}</div>

                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                    <span style={{ fontSize:'14px', fontWeight:500 }}>{swap.mentorName}</span>
                    <span style={{ fontSize:'12px', padding:'2px 8px', borderRadius:'20px', background:ss.bg, color:ss.text, fontWeight:500 }}>
                      {swap.status}
                    </span>
                  </div>
                  <div style={{ fontSize:'12px', color:'#888' }}>
                    Skill: <b>{swap.skill}</b> · Next: {swap.nextSession}
                    {swap.sessionsLeft > 0 && ` · ${swap.sessionsLeft} sessions left`}
                  </div>
                </div>

                <div style={{ display:'flex', gap:'8px' }}>
                  {swap.status === 'active' && (
                    <button className="btn-primary" style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'10px' }}>
                      Join session
                    </button>
                  )}
                  <button className="btn-secondary" style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'10px' }}
                    onClick={() => navigate(`/mentor/${swap.mentorId}`)}>
                    View profile
                  </button>
                  <button className="btn-secondary" style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'10px' }}
                    onClick={() => navigate('/messages')}>
                    Message
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px', color:'#aaa', fontSize:'14px' }}>
              No {tab.toLowerCase()} swaps yet.{' '}
              <span style={{ color:'var(--lav-600)', cursor:'pointer', fontWeight:500 }}
                onClick={() => navigate('/explore')}>Find a mentor →</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
