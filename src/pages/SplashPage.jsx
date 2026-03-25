import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

export default function SplashPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { profile } = useUser()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--lav-50) 0%, var(--mint-50) 100%)',
    }}>
      <div className="animate-splash" style={{ textAlign: 'center' }}>
        {/* Logo mark */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'var(--lav-600)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <path d="M8 28L19 10L30 28" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22h14" stroke="#7DDBB8" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="19" cy="10" r="3" fill="#7DDBB8"/>
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.5px' }}>
          <span style={{ color: 'var(--lav-600)' }}>skill</span>
          <span style={{ color: 'var(--mint-600)' }}>swap</span>
        </div>
        <div style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
          Learn anything. Teach everything.
        </div>
      </div>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '48px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--lav-200)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
