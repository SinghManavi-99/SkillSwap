import Navbar from '../components/Navbar'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { SKILL_PATHS } from '../data/Mockdata'

const XP_TO_NEXT = 300
const CURRENT_XP = 240

const ACHIEVEMENTS = [
  { emoji:'🌱', label:'First swap',       done:true  },
  { emoji:'🔥', label:'7-day streak',     done:true  },
  { emoji:'⚡', label:'5 skills learned', done:false },
  { emoji:'🏆', label:'Top learner',      done:false },
  { emoji:'🎯', label:'10 sessions done', done:true  },
  { emoji:'✨', label:'Verified Seeker',  done:false },
]

const WEEK_DAYS = ['M','T','W','T','F','S','S']
const WEEK_ACTIVE = [true, true, false, true, true, true, false]

export default function ProgressPage() {
  const { profile } = useUser()
  const navigate = useNavigate()
  const xpPct = Math.round((CURRENT_XP / XP_TO_NEXT) * 100)

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--surf)' }}>
      <Navbar />
      <div style={{ padding:'20px 24px 40px', display:'flex', flexDirection:'column', gap:'16px' }}>

        <div>
          <h1 style={{ fontSize:'20px', fontWeight:500, marginBottom:'4px' }}>My progress</h1>
          <p style={{ fontSize:'13px', color:'#888' }}>Track your learning journey, streaks, and achievements.</p>
        </div>

        {/* XP + level card */}
        <div className="card" style={{ padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <div>
              <div style={{ fontSize:'13px', color:'#888', marginBottom:'4px' }}>Current level</div>
              <div style={{ fontSize:'24px', fontWeight:500, color:'var(--lav-600)' }}>Level 6 Seeker</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'13px', color:'#888', marginBottom:'4px' }}>Total XP</div>
              <div style={{ fontSize:'24px', fontWeight:500, color:'var(--lem-600)' }}>1,240 XP</div>
            </div>
          </div>
          <div style={{ marginBottom:'6px', display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#888' }}>
            <span>Progress to Level 7</span>
            <span>{CURRENT_XP} / {XP_TO_NEXT} XP</span>
          </div>
          <div style={{ height:'8px', borderRadius:'4px', background:'var(--lav-50)', border:'0.5px solid var(--lav-100)' }}>
            <div style={{ height:'8px', borderRadius:'4px', background:'var(--lav-600)', width:`${xpPct}%`, transition:'width .5s' }} />
          </div>
          <div style={{ fontSize:'11px', color:'#aaa', marginTop:'6px' }}>{XP_TO_NEXT - CURRENT_XP} XP to next level</div>
        </div>

        {/* Streak + stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:'10px' }}>
          {[
            { label:'Current streak', val:'12 days', sub:'🔥 Keep it up!',    color:'var(--peach-600)' },
            { label:'Sessions done',  val:'47',      sub:'This month: 12',    color:'var(--mint-600)'  },
            { label:'Skills learned', val: profile.skillsWanted.length || 5, sub:'2 in progress', color:'var(--lav-600)' },
            { label:'Mentors swapped', val:'4',      sub:'1 ongoing swap',    color:'var(--sky-600)'   },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:'12px 14px' }}>
              <div style={{ fontSize:'11px', color:'#888', marginBottom:'4px' }}>{s.label}</div>
              <div style={{ fontSize:'22px', fontWeight:500, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:'11px', color:'#aaa', marginTop:'2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Weekly activity */}
        <div className="card" style={{ padding:'16px 20px' }}>
          <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'14px' }}>This week's activity</div>
          <div style={{ display:'flex', gap:'8px' }}>
            {WEEK_DAYS.map((d, i) => (
              <div key={i} style={{ flex:1, textAlign:'center' }}>
                <div style={{
                  width:'100%', aspectRatio:'1', borderRadius:'10px', marginBottom:'6px',
                  background: WEEK_ACTIVE[i] ? 'var(--lav-600)' : 'var(--lav-50)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'14px',
                }}>
                  {WEEK_ACTIVE[i] ? '✓' : ''}
                </div>
                <div style={{ fontSize:'11px', color: WEEK_ACTIVE[i] ? 'var(--lav-600)' : '#ccc', fontWeight: WEEK_ACTIVE[i] ? 500 : 400 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill paths */}
        <div className="card" style={{ padding:'16px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <span style={{ fontSize:'13px', fontWeight:500 }}>Skill paths</span>
            <button className="btn-ghost" style={{ fontSize:'12px', padding:'4px 12px' }}
              onClick={() => navigate('/seeker')}>Browse more →</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {SKILL_PATHS.map(path => (
              <div key={path.id} style={{
                border:'0.5px solid var(--lav-100)', borderRadius:'12px', padding:'12px 14px', cursor:'pointer',
              }} onClick={() => navigate(`/path/${path.id}`)}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'13px', fontWeight:500 }}>{path.name}</span>
                  <span style={{ fontSize:'11px', color:'#888' }}>{path.completedSessions}/{path.totalSessions} sessions</span>
                </div>
                <div style={{ height:'6px', borderRadius:'3px', background:'var(--lav-50)' }}>
                  <div style={{ height:'6px', borderRadius:'3px', background:'var(--lav-600)', width:`${path.progress}%` }} />
                </div>
                <div style={{ fontSize:'11px', color:'var(--lav-600)', marginTop:'5px', fontWeight:500 }}>
                  {path.progress > 0 ? `${path.progress}% complete` : 'Not started'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card" style={{ padding:'16px 20px' }}>
          <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'14px' }}>Achievements</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:'10px' }}>
            {ACHIEVEMENTS.map((a, i) => (
              <div key={i} style={{
                border:`0.5px solid ${a.done ? 'var(--lem-200)' : 'var(--lav-100)'}`,
                borderRadius:'12px', padding:'12px',
                background: a.done ? 'var(--lem-50)' : 'var(--surf)',
                textAlign:'center', opacity: a.done ? 1 : 0.5,
              }}>
                <div style={{ fontSize:'24px', marginBottom:'6px' }}>{a.emoji}</div>
                <div style={{ fontSize:'11px', fontWeight:500, color: a.done ? 'var(--lem-600)' : '#888' }}>{a.label}</div>
                {a.done && <div style={{ fontSize:'10px', color:'var(--lem-600)', marginTop:'3px' }}>Unlocked!</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
