import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { SKILLS } from '../data/Mockdata'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { profile, updateProfile } = useUser()
  const navigate = useNavigate()

  const [name,     setName]     = useState(user?.name || '')
  const [bio,      setBio]      = useState(profile.bio || '')
  const [location, setLocation] = useState(profile.location || '')
  const [offered,  setOffered]  = useState(profile.skillsOffered || [])
  const [wanted,   setWanted]   = useState(profile.skillsWanted  || [])
  const [saved,    setSaved]    = useState(false)

  function toggleSkill(skill, list, setList) {
    setList(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  function handleSave() {
    updateProfile({ bio, location, skillsOffered: offered, skillsWanted: wanted })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const SECTIONS = [
    { id:'profile',  label:'Profile'          },
    { id:'skills',   label:'Skills'           },
    { id:'notif',    label:'Notifications'    },
    { id:'privacy',  label:'Privacy'          },
  ]
  const [active, setActive] = useState('profile')

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--surf)' }}>
      <Navbar />
      <div style={{ display:'flex', gap:'20px', padding:'20px 24px 40px', alignItems:'flex-start' }}>

        {/* Sidebar */}
        <aside style={{ width:'200px', flexShrink:0 }}>
          <div className="card" style={{ padding:'8px' }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} style={{
                display:'block', width:'100%', textAlign:'left', padding:'9px 12px', borderRadius:'10px',
                border:'none', cursor:'pointer', fontSize:'13px', transition:'background .12s',
                background: active === s.id ? 'var(--lav-50)' : 'transparent',
                color: active === s.id ? 'var(--lav-600)' : '#444',
                fontWeight: active === s.id ? 500 : 400,
              }}>{s.label}</button>
            ))}
            <hr className="divider" style={{ margin:'8px 0' }} />
            <button onClick={handleLogout} style={{
              display:'block', width:'100%', textAlign:'left', padding:'9px 12px', borderRadius:'10px',
              border:'none', cursor:'pointer', fontSize:'13px', background:'transparent',
              color:'var(--peach-600)', transition:'background .12s',
            }}>Log out</button>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'14px', minWidth:0 }}>

          {active === 'profile' && (
            <div className="card" style={{ padding:'20px' }}>
              <div style={{ fontSize:'15px', fontWeight:500, marginBottom:'20px' }}>Profile settings</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Display name</label>
                  <input className="input-base" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Email</label>
                  <input className="input-base" value={user?.email || ''} disabled style={{ opacity:0.6, cursor:'not-allowed' }} />
                </div>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Location</label>
                  <input className="input-base" placeholder="e.g. Mumbai, India" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Bio</label>
                  <textarea className="input-base" rows={3} style={{ resize:'none' }} value={bio} onChange={e => setBio(e.target.value)} />
                </div>
                <button className="btn-primary" style={{ alignSelf:'flex-start', padding:'10px 24px', borderRadius:'12px' }} onClick={handleSave}>
                  {saved ? '✓ Saved!' : 'Save changes'}
                </button>
              </div>
            </div>
          )}

          {active === 'skills' && (
            <div className="card" style={{ padding:'20px' }}>
              <div style={{ fontSize:'15px', fontWeight:500, marginBottom:'20px' }}>Skills settings</div>

              <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'13px', fontWeight:500, color:'var(--mint-600)', marginBottom:'10px' }}>Skills I can teach</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {SKILLS.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill, offered, setOffered)} style={{
                      padding:'5px 12px', borderRadius:'20px', fontSize:'12px', cursor:'pointer',
                      border: offered.includes(skill) ? '2px solid var(--mint-600)' : '0.5px solid var(--lav-100)',
                      background: offered.includes(skill) ? 'var(--mint-50)' : '#fff',
                      color: offered.includes(skill) ? 'var(--mint-600)' : '#555',
                      fontWeight: offered.includes(skill) ? 500 : 400, transition:'all .12s',
                    }}>{skill}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'13px', fontWeight:500, color:'var(--lav-600)', marginBottom:'10px' }}>Skills I want to learn</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {SKILLS.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill, wanted, setWanted)} style={{
                      padding:'5px 12px', borderRadius:'20px', fontSize:'12px', cursor:'pointer',
                      border: wanted.includes(skill) ? '2px solid var(--lav-600)' : '0.5px solid var(--lav-100)',
                      background: wanted.includes(skill) ? 'var(--lav-50)' : '#fff',
                      color: wanted.includes(skill) ? 'var(--lav-600)' : '#555',
                      fontWeight: wanted.includes(skill) ? 500 : 400, transition:'all .12s',
                    }}>{skill}</button>
                  ))}
                </div>
              </div>

              <button className="btn-primary" style={{ padding:'10px 24px', borderRadius:'12px' }} onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save skills'}
              </button>
            </div>
          )}

          {active === 'notif' && (
            <div className="card" style={{ padding:'20px' }}>
              <div style={{ fontSize:'15px', fontWeight:500, marginBottom:'20px' }}>Notification preferences</div>
              {[
                { label:'New swap requests',        sub:'Get notified when someone wants to swap with you' },
                { label:'Session reminders',        sub:'Reminders 30 min before a session starts' },
                { label:'Messages',                 sub:'New messages from your swap partners' },
                { label:'Progress milestones',      sub:'When you level up or earn achievements' },
                { label:'Trending skills digest',   sub:'Weekly email about trending skills' },
              ].map((n, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'0.5px solid var(--lav-100)' }}>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:500 }}>{n.label}</div>
                    <div style={{ fontSize:'11px', color:'#888', marginTop:'2px' }}>{n.sub}</div>
                  </div>
                  <label style={{ position:'relative', width:'36px', height:'20px', cursor:'pointer' }}>
                    <input type="checkbox" defaultChecked={i < 3} style={{ opacity:0, width:0, height:0 }}
                      onChange={() => {}} />
                    <span style={{
                      position:'absolute', inset:0, borderRadius:'10px',
                      background:'var(--lav-600)', cursor:'pointer',
                    }} />
                  </label>
                </div>
              ))}
            </div>
          )}

          {active === 'privacy' && (
            <div className="card" style={{ padding:'20px' }}>
              <div style={{ fontSize:'15px', fontWeight:500, marginBottom:'20px' }}>Privacy settings</div>
              {[
                { label:'Show my profile to others',        def:true  },
                { label:'Show my skills publicly',          def:true  },
                { label:'Allow swap requests from anyone',  def:true  },
                { label:'Show online status',               def:false },
                { label:'Share learning progress publicly', def:false },
              ].map((p, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'0.5px solid var(--lav-100)' }}>
                  <div style={{ fontSize:'13px' }}>{p.label}</div>
                  <input type="checkbox" defaultChecked={p.def} />
                </div>
              ))}
              <div style={{ marginTop:'16px' }}>
                <button style={{ fontSize:'12px', padding:'8px 16px', borderRadius:'10px', border:'0.5px solid var(--peach-200)', background:'var(--peach-50)', color:'var(--peach-600)', cursor:'pointer' }}>
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
