import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { SKILLS } from '../data/Mockdata'

const ROLE_DEST = { seeker: '/seeker', sage: '/sage', catalyst: '/catalyst' }

export default function OnboardingPage() {
  const { profile, updateProfile } = useUser()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1 fields
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  // Step 2 fields
  const [offered, setOffered] = useState([])
  const [wanted, setWanted] = useState([])

  function toggleSkill(skill, list, setList) {
    setList(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  function handleStep1(e) {
    e.preventDefault()
    setStep(2)
  }

  function handleFinish(e) {
    e.preventDefault()
    updateProfile({
      bio, location,
      skillsOffered: offered,
      skillsWanted: wanted,
      onboardingComplete: true,
    })
    navigate(ROLE_DEST[profile.role] || '/seeker')
  }

  const stepBar = (n) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: i <= n ? 'var(--lav-600)' : 'var(--lav-100)',
            color: i <= n ? '#fff' : 'var(--lav-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 500,
          }}>{i}</div>
          {i < 2 && <div style={{ width: '40px', height: '2px', background: n >= 2 ? 'var(--lav-600)' : 'var(--lav-100)', borderRadius: '1px' }} />}
        </div>
      ))}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surf)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }} className="animate-fadeIn">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '22px', fontWeight: 600 }}>
            <span style={{ color: 'var(--lav-600)' }}>skill</span>
            <span style={{ color: 'var(--mint-600)' }}>swap</span>
          </span>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '6px' }}>
            {step === 1 ? `Welcome, ${user?.name?.split(' ')[0] || 'there'}! Let's set up your profile.` : 'Now tell us about your skills.'}
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {stepBar(step)}

          {step === 1 ? (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#111', display: 'block', marginBottom: '6px' }}>Your location</label>
                <input className="input-base" placeholder="e.g. Mumbai, India" value={location}
                  onChange={e => setLocation(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#111', display: 'block', marginBottom: '6px' }}>Short bio</label>
                <textarea className="input-base" rows={3} placeholder="Tell others a bit about yourself..."
                  value={bio} onChange={e => setBio(e.target.value)} style={{ resize: 'none' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '12px', marginTop: '4px' }}>
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinish} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Skills offered */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--mint-600)', marginBottom: '8px' }}>
                  🌟 Skills I can teach ({offered.length} selected)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SKILLS.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill, offered, setOffered)}
                      style={{
                        padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                        border: offered.includes(skill) ? '2px solid var(--mint-600)' : '0.5px solid var(--lav-100)',
                        background: offered.includes(skill) ? 'var(--mint-50)' : '#fff',
                        color: offered.includes(skill) ? 'var(--mint-600)' : '#555',
                        fontWeight: offered.includes(skill) ? 500 : 400,
                        transition: 'all .12s',
                      }}
                    >{skill}</button>
                  ))}
                </div>
              </div>

              {/* Skills wanted */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--lav-600)', marginBottom: '8px' }}>
                  🎯 Skills I want to learn ({wanted.length} selected)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SKILLS.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill, wanted, setWanted)}
                      style={{
                        padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                        border: wanted.includes(skill) ? '2px solid var(--lav-600)' : '0.5px solid var(--lav-100)',
                        background: wanted.includes(skill) ? 'var(--lav-50)' : '#fff',
                        color: wanted.includes(skill) ? 'var(--lav-600)' : '#555',
                        fontWeight: wanted.includes(skill) ? 500 : 400,
                        transition: 'all .12s',
                      }}
                    >{skill}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}
                  style={{ flex: '0 0 80px', padding: '10px', borderRadius: '12px' }}>
                  ← Back
                </button>
                <button type="submit" className="btn-primary"
                  style={{ flex: 1, padding: '10px', borderRadius: '12px' }}>
                  Go to my dashboard →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
