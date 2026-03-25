import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

const ROLES = [
  { value: 'seeker',   emoji: '🌱', label: 'Seeker',   desc: 'I want to learn new skills' },
  { value: 'sage',     emoji: '🔥', label: 'Sage',     desc: 'I want to teach my skills' },
  { value: 'catalyst', emoji: '⚡', label: 'Catalyst', desc: 'I want to do both' },
]

export default function RegisterPage() {
  const { login } = useAuth()
  const { updateProfile } = useUser()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (!role) { setError('Please choose your role.'); return }
    login({ email: form.email, name: form.name })
    updateProfile({ role })
    navigate('/onboarding')
  }

  function handleGoogle() {
    if (!role) { setError('Please choose your role first.'); return }
    login({ email: 'demo@google.com', name: 'Demo User' })
    updateProfile({ role })
    navigate('/onboarding')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surf)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fadeIn">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '26px', fontWeight: 600 }}>
              <span style={{ color: 'var(--lav-600)' }}>skill</span>
              <span style={{ color: 'var(--mint-600)' }}>swap</span>
            </span>
          </Link>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>Create your account</p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {/* Role selector */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#111', marginBottom: '10px' }}>I am a...</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  style={{
                    flex: 1, padding: '10px 6px', borderRadius: '12px',
                    border: role === r.value ? '2px solid var(--lav-600)' : '0.5px solid var(--lav-100)',
                    background: role === r.value ? 'var(--lav-50)' : '#fff',
                    cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{r.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: role === r.value ? 'var(--lav-600)' : '#111' }}>{r.label}</div>
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '2px', lineHeight: 1.3 }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#111', display: 'block', marginBottom: '5px' }}>Full name</label>
              <input name="name" type="text" className="input-base" placeholder="Aarav Sharma"
                value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#111', display: 'block', marginBottom: '5px' }}>Email</label>
              <input name="email" type="email" className="input-base" placeholder="you@example.com"
                value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#111', display: 'block', marginBottom: '5px' }}>Password</label>
              <input name="password" type="password" className="input-base" placeholder="At least 8 characters"
                value={form.password} onChange={handleChange} />
            </div>

            {error && <p style={{ fontSize: '12px', color: 'var(--peach-600)' }}>{error}</p>}

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '12px', marginTop: '4px' }}>
              Create account
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
            <hr className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: '12px', color: '#aaa' }}>or</span>
            <hr className="divider" style={{ flex: 1 }} />
          </div>

          <button onClick={handleGoogle} style={{
            width: '100%', padding: '10px', borderRadius: '12px',
            border: '0.5px solid var(--lav-100)', background: '#fff',
            fontSize: '13px', fontWeight: 500, color: '#333', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58Z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--lav-600)', fontWeight: 500, textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}
