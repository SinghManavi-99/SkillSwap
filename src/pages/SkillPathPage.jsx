import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { SKILL_PATHS, MENTORS } from '../data/Mockdata'
import MentorCard from '../components/MentorCard'
import { useUser } from '../context/UserContext'
import { getMatchedSkills } from '../utils/MatchScore'

export default function SkillPathPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useUser()
  const path = SKILL_PATHS.find(p => p.id === id) || SKILL_PATHS[0]

  const relevantMentors = MENTORS.filter(m =>
    path.steps.some(step =>
      m.skillsOffered.some(s => s.toLowerCase().includes(step.name.toLowerCase()))
    )
  ).slice(0, 3)

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--surf)' }}>
      <Navbar />

      <div style={{ padding:'20px 24px 40px', maxWidth:'800px', margin:'0 auto', width:'100%' }}>
        {/* Breadcrumb */}
        <div style={{ display:'flex', gap:'6px', fontSize:'12px', color:'#888', marginBottom:'16px' }}>
          <span style={{ color:'var(--lav-600)', cursor:'pointer' }} onClick={() => navigate(-1)}>Dashboard</span>
          <span>/</span>
          <span>Skill paths</span>
          <span>/</span>
          <span>{path.name}</span>
        </div>

        {/* Header */}
        <div className="card" style={{ padding:'20px', marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
            <div>
              <h1 style={{ fontSize:'20px', fontWeight:500, marginBottom:'4px' }}>{path.name}</h1>
              <p style={{ fontSize:'13px', color:'#888' }}>{path.description}</p>
            </div>
            <span className="pill pill-lav" style={{ fontSize:'11px', whiteSpace:'nowrap', marginLeft:'16px' }}>{path.duration}</span>
          </div>

          <div style={{ marginBottom:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'6px' }}>
              <span style={{ color:'#888' }}>Overall progress</span>
              <span style={{ fontWeight:500, color:'var(--lav-600)' }}>{path.completedSessions}/{path.totalSessions} sessions · {path.progress}%</span>
            </div>
            <div style={{ height:'8px', borderRadius:'4px', background:'var(--lav-50)' }}>
              <div style={{ height:'8px', borderRadius:'4px', background:'var(--lav-600)', width:`${path.progress}%` }} />
            </div>
          </div>

          <button className="btn-primary" style={{ padding:'10px 24px', borderRadius:'12px' }}>
            {path.progress > 0 ? 'Continue learning' : 'Start this path'}
          </button>
        </div>

        {/* Steps */}
        <div className="card" style={{ padding:'16px 20px', marginBottom:'16px' }}>
          <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'14px' }}>Path steps</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {path.steps.map((step, i) => {
              const done = i < Math.ceil((path.progress / 100) * path.steps.length)
              return (
                <div key={step.name} style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  padding:'12px 14px', borderRadius:'12px',
                  border:`0.5px solid ${done ? 'var(--mint-200)' : 'var(--lav-100)'}`,
                  background: done ? 'var(--mint-50)' : '#fff',
                }}>
                  <div style={{
                    width:'28px', height:'28px', borderRadius:'50%', flexShrink:0,
                    background: done ? 'var(--mint-600)' : 'var(--lav-50)',
                    color: done ? '#fff' : 'var(--lav-600)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'12px', fontWeight:500,
                  }}>{done ? '✓' : i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', fontWeight:500, color: done ? 'var(--mint-600)' : '#111' }}>{step.name}</div>
                    <div style={{ fontSize:'11px', color:'#888', marginTop:'2px' }}>
                      {done ? 'Completed' : i === Math.ceil((path.progress / 100) * path.steps.length) ? 'In progress' : 'Not started'}
                    </div>
                  </div>
                  <span className={`pill pill-${step.color}`} style={{ fontSize:'10px' }}>{step.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommended mentors for this path */}
        {relevantMentors.length > 0 && (
          <div className="card" style={{ padding:'16px 20px' }}>
            <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'14px' }}>Mentors for this path</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'12px' }}>
              {relevantMentors.map(m => (
                <MentorCard key={m.id} mentor={m} matchedSkills={getMatchedSkills(profile.skillsWanted, m.skillsOffered)} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
