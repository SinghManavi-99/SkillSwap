import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthActions } from '../hooks/useAuth'

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function RegisterPage() {
  const { handleRegister, handleGoogleLogin, loading, error } = useAuthActions()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const gBtn = useRef(null)

  useEffect(() => {
    if (!GOOGLE_ID || !gBtn.current) return
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true
    s.onload = () => {
      window.google?.accounts?.id?.initialize({ client_id: GOOGLE_ID, callback: r => handleGoogleLogin(r.credential) })
      window.google?.accounts?.id?.renderButton(gBtn.current, { type: 'standard', theme: 'outline', size: 'large', text: 'signup_with', width: '100%' })
    }
    document.head.appendChild(s)
    return () => { try { document.head.removeChild(s) } catch {} }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--bg2)' }}>
      <div className="w-full max-w-md" style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow)' }}>
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'var(--purple)' }}>S</div>
            <span className="font-bold text-xl" style={{ color: 'var(--text)' }}>SkillSwap</span>
          </Link>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>Create account</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>Join the SkillSwap community</p>
        </div>

        <div className="flex rounded-xl p-1 gap-1 mb-6" style={{ background: 'var(--bg3)' }}>
          <Link to="/login"    className="flex-1 text-center py-2 text-sm font-medium" style={{ color: 'var(--text3)' }}>Sign In</Link>
          <Link to="/register" className="flex-1 text-center py-2 text-sm font-semibold rounded-lg" style={{ background: 'var(--card-bg)', color: 'var(--text)' }}>Sign Up</Link>
        </div>

        {error && <div className="text-sm rounded-xl px-4 py-3 mb-4" style={{ background: '#FEE2E2', color: '#991B1B' }}>{error}</div>}

        <form onSubmit={e => { e.preventDefault(); handleRegister(name, email, password) }} className="space-y-4">
          {[['Full Name', 'text', name, setName, 'Your name'], ['Email Address', 'email', email, setEmail, 'you@example.com'], ['Password', 'password', password, setPassword, 'Min 6 characters']].map(([lbl, type, val, set, ph]) => (
            <div key={lbl}>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text2)' }}>{lbl}</label>
              <input className="input-field" type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} required minLength={type === 'password' ? 6 : 1} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1" style={{ borderColor: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--text3)' }}>or sign up with</span>
          <hr className="flex-1" style={{ borderColor: 'var(--border)' }} />
        </div>

        {GOOGLE_ID ? <div ref={gBtn} className="flex justify-center" /> :
          <button className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-3" style={{ border: '1.5px solid var(--border)', color: 'var(--text2)' }}>G Sign up with Google</button>}

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text3)' }}>
          Already have an account? <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--purple)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}