import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SwapRequestModal from '../components/SwapRequestModal'
import { useUser } from '../context/UserContext'
import { MENTORS } from '../data/Mockdata'
import { getMatchedSkills } from '../utils/MatchScore'

export default function MentorProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useUser()
  const mentor = MENTORS.find(m => m.id === id) || MENTORS[0]
  const [showModal, setShowModal] = useState(false)
  const matched = getMatchedSkills(profile.skillsWanted, mentor.skillsOffered)

  const DAY_ORDER = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--surf)' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'12px 24px 0', fontSize:'12px', color:'#888' }}>
        <span style={{ color:'var(--lav-600)', cursor:'pointer' }} onClick={() => navigate(-2)}>Dashboard</span>
        <span>/</span>
        <span style={{ color:'var(--lav-600)', cursor:'pointer' }} onClick={() => navigate(-1)}>Browse mentors</span>
        <span>/</span>
        <span>{mentor.name}</span>
      </div>

      <div style={{ display:'flex', gap:'20px', padding:'16px 24px 40px', alignItems:'flex-start' }}>

        {/* ── Left panel ── */}
        <aside style={{ width:'260px', flexShrink:0, display:'flex', flexDirection:'column', gap:'12px' }}>

          {/* Profile card */}
          <div className="card" style={{ padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', textAlign:'center' }}>
            <div style={{
              width:'72px', height:'72px', borderRadius:'50%',
              background:'var(--mint-50)', color:'var(--mint-600)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'22px', fontWeight:500,
              border:'2.5px solid var(--mint-200)',
            }}>{mentor.initials}</div>

            <div>
              <div style={{ fontSize:'17px', fontWeight:500 }}>{mentor.name}</div>
              <div style={{ fontSize:'12px', color:'#888', marginTop:'2px' }}>{mentor.title} · {mentor.experience}</div>
              <div style={{ fontSize:'12px', color:'#888', marginTop:'4px' }}>📍 {mentor.location}</div>
            </div>

            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'center' }}>
              {mentor.verified && <span className="pill pill-mint" style={{ fontSize:'10px' }}>Verified sage</span>}
              {mentor.topPct  && <span className="pill pill-lem"  style={{ fontSize:'10px' }}>Top {mentor.topPct}%</span>}
              {mentor.activeNow && <span className="pill pill-mint" style={{ fontSize:'10px' }}>● Active now</span>}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <span style={{ color:'#D4A000', fontSize:'16px' }}>{'★'.repeat(Math.floor(mentor.rating))}{'☆'.repeat(5-Math.floor(mentor.rating))}</span>
              <span style={{ fontWeight:500 }}>{mentor.rating}</span>
              <span style={{ fontSize:'12px', color:'#888' }}>({mentor.reviews} reviews)</span>
            </div>

            <hr className="divider" style={{ width:'100%' }} />

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', width:'100%' }}>
              {[
                { label:'Swaps done',    val: mentor.swapsDone    },
                { label:'Hours taught',  val: `${mentor.hoursTaught}h` },
                { label:'Response rate', val: `${mentor.responseRate}%` },
                { label:'Avg reply',     val: mentor.replyTime    },
              ].map(s => (
                <div key={s.label} style={{ background:'var(--surf)', borderRadius:'10px', padding:'8px', textAlign:'center', border:'0.5px solid var(--lav-100)' }}>
                  <div style={{ fontSize:'16px', fontWeight:500, color:'var(--lav-600)' }}>{s.val}</div>
                  <div style={{ fontSize:'10px', color:'#888', marginTop:'2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width:'100%', padding:'10px', borderRadius:'12px' }}
              onClick={() => setShowModal(true)}>
              Request a swap
            </button>
            <button className="btn-secondary" style={{ width:'100%', padding:'9px', borderRadius:'12px' }}
              onClick={() => navigate('/messages')}>
              Send message
            </button>
          </div>

          {/* Availability */}
          <div className="card" style={{ padding:'14px 16px' }}>
            <div style={{ fontSize:'12px', fontWeight:500, marginBottom:'10px' }}>Availability</div>
            <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
              {DAY_ORDER.map(day => {
                const on = mentor.availability.includes(day)
                return (
                  <span key={day} className={`pill ${on ? 'pill-lav' : ''}`}
                    style={{ fontSize:'11px', background: on ? undefined : 'var(--surf)', color: on ? undefined : '#bbb', border: on ? undefined : '0.5px solid var(--lav-100)' }}>
                    {day}
                  </span>
                )
              })}
            </div>
            <div style={{ fontSize:'11px', color:'#888', marginTop:'8px' }}>{mentor.availTime} · {mentor.mode}</div>
          </div>

          {/* Swap offers */}
          <div className="card" style={{ padding:'14px 16px' }}>
            <div style={{ fontSize:'12px', fontWeight:500, marginBottom:'10px' }}>Open swap offers</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {mentor.swapOffers.map((o, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'12px', flexWrap:'wrap', gap:'4px' }}>
                  <span>{o.teach}</span>
                  <span style={{ fontSize:'11px', color:'#aaa' }}>for</span>
                  <span className={`pill pill-${o.wantColor}`} style={{ fontSize:'10px' }}>{o.want}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'14px', minWidth:0 }}>

          {/* About */}
          <div className="card" style={{ padding:'16px 20px' }}>
            <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'10px' }}>About</div>
            <p style={{ fontSize:'13px', color:'#555', lineHeight:1.7 }}>{mentor.bio}</p>
            {mentor.bio2 && <p style={{ fontSize:'13px', color:'#555', lineHeight:1.7, marginTop:'8px' }}>{mentor.bio2}</p>}
          </div>

          {/* Skills */}
          <div className="card" style={{ padding:'16px 20px' }}>
            <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'12px' }}>Skills</div>

            <div style={{ marginBottom:'12px' }}>
              <div style={{ fontSize:'11px', fontWeight:500, color:'var(--mint-600)', marginBottom:'6px' }}>Can teach</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {mentor.skillsOffered.map(s => {
                  const isMatch = matched.map(x => x.toLowerCase()).includes(s.toLowerCase())
                  return (
                    <span key={s} className={`pill ${isMatch ? 'pill-lem' : 'pill-mint'}`} style={{ fontSize:'11px' }}>
                      {isMatch && '✦ '}{s}
                    </span>
                  )
                })}
              </div>
            </div>

            <hr className="divider" style={{ margin:'10px 0' }} />

            <div>
              <div style={{ fontSize:'11px', fontWeight:500, color:'var(--lav-600)', marginBottom:'6px' }}>Wants to learn</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {mentor.skillsWanted.map(s => (
                  <span key={s} className="pill pill-lav" style={{ fontSize:'11px' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:'14px', marginTop:'12px', flexWrap:'wrap' }}>
              {[
                { color:'var(--mint-200)', label:'Can teach' },
                { color:'var(--lav-200)',  label:'Wants to learn' },
                { color:'var(--lem-200)',  label:'Matches your goals' },
              ].map(l => (
                <div key={l.label} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#888' }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="card" style={{ padding:'16px 20px' }}>
            <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'12px' }}>Portfolio</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:'8px' }}>
              {mentor.portfolio.map((p, i) => (
                <div key={i} style={{
                  border:'0.5px solid var(--lav-100)', borderRadius:'10px', padding:'10px 12px', cursor:'pointer',
                  transition:'border-color .15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--lav-200)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--lav-100)'}
                >
                  <div style={{
                    width:'28px', height:'28px', borderRadius:'8px', marginBottom:'6px',
                    background:`var(--${p.color}-50)`, display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'14px',
                  }}>📁</div>
                  <div style={{ fontSize:'11px', fontWeight:500 }}>{p.name}</div>
                  <div style={{ fontSize:'10px', color:'#aaa', marginTop:'2px' }}>{p.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="card" style={{ padding:'16px 20px' }}>
            <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'12px' }}>Reviews ({mentor.reviews})</div>

            {/* Rating breakdown */}
            <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px' }}>
              {Object.entries(mentor.ratingBreakdown).map(([key, val]) => (
                <div key={key} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'110px', fontSize:'11px', color:'#666', flexShrink:0 }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                  </span>
                  <div style={{ flex:1, height:'5px', borderRadius:'3px', background:'var(--lav-50)' }}>
                    <div style={{ height:'5px', borderRadius:'3px', background:'var(--lav-600)', width:`${(val/5)*100}%` }} />
                  </div>
                  <span style={{ width:'28px', textAlign:'right', fontSize:'11px', fontWeight:500, color:'var(--lav-600)' }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {mentor.reviewsList.map((r, i) => (
                <div key={i} style={{ border:'0.5px solid var(--lav-100)', borderRadius:'12px', padding:'12px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{
                        width:'28px', height:'28px', borderRadius:'50%', flexShrink:0,
                        background:`var(--${r.color}-50)`, color:`var(--${r.color}-600)`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:500,
                      }}>{r.initials}</div>
                      <div>
                        <div style={{ fontSize:'12px', fontWeight:500 }}>{r.name}</div>
                        <div style={{ fontSize:'11px', color:'#aaa' }}>{r.date}</div>
                      </div>
                    </div>
                    <span style={{ color:'#D4A000', fontSize:'12px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                  </div>
                  <p style={{ fontSize:'12px', color:'#555', lineHeight:1.6 }}>{r.text}</p>
                  <span className="pill pill-mint" style={{ fontSize:'10px', marginTop:'6px', display:'inline-block' }}>{r.skill}</span>
                </div>
              ))}
            </div>

            <button className="btn-ghost" style={{ width:'100%', marginTop:'10px', fontSize:'12px', padding:'8px' }}>
              View all {mentor.reviews} reviews →
            </button>
          </div>
        </div>
      </div>

      {/* Modal overlay */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(60,40,120,0.25)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div style={{ width:'100%', maxWidth:'460px' }}>
            <SwapRequestModal mentor={mentor} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
