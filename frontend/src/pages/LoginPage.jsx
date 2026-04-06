import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthActions } from '../hooks/useAuth'
import { useScrollReveal } from '../hooks/useTheme'

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginPage() {
  const { handleLogin, handleGoogleLogin, loading, error } = useAuthActions()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const gBtn = useRef(null)
  useScrollReveal()

  // 🔥 Google login setup
  useEffect(() => {
    if (!GOOGLE_ID || !gBtn.current) return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true

    script.onload = () => {
      window.google?.accounts?.id?.initialize({
        client_id: GOOGLE_ID,
        callback: (res) => handleGoogleLogin(res.credential)
      })

      window.google?.accounts?.id?.renderButton(gBtn.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: '100%'
      })
    }

    document.head.appendChild(script)

    return () => {
      try {
        document.head.removeChild(script)
      } catch {}
    }
  }, [])

  // 🔥 Submit handler
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      return alert('Please fill all fields')
    }

    handleLogin(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--bg2)' }}>
      
      <div className="w-full max-w-md reveal" style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow)' }}>

        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'var(--purple)' }}>S</div>
            <span className="font-bold text-xl" style={{ color: 'var(--text)' }}>SkillSwap</span>
          </Link>

          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
            Welcome back
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>
            Sign in to your account
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl p-1 gap-1 mb-6" style={{ background: 'var(--bg3)' }}>
          <Link to="/login" className="flex-1 text-center py-2 text-sm font-semibold rounded-lg" style={{ background: 'var(--card-bg)', color: 'var(--text)' }}>
            Sign In
          </Link>
          <Link to="/register" className="flex-1 text-center py-2 text-sm font-medium" style={{ color: 'var(--text3)' }}>
            Sign Up
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-4" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-bold mb-1">Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={email}
              disabled={loading}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              disabled={loading}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1" />
          <span className="text-xs">or continue with</span>
          <hr className="flex-1" />
        </div>

        {/* Google */}
        {GOOGLE_ID ? (
          <div ref={gBtn} className="flex justify-center" />
        ) : (
          <button className="w-full border py-3 rounded">
            Google Sign In
          </button>
        )}

        {/* Footer */}
        <p className="text-center text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-purple-500">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}