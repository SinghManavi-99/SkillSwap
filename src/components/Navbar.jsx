import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

const ROLE_CONFIG = {
  seeker:   { label: 'Seeker',   pillClass: 'pill-mint',  dashPath: '/seeker'   },
  sage:     { label: 'Sage',     pillClass: 'pill-peach', dashPath: '/sage'     },
  catalyst: { label: 'Catalyst', pillClass: 'pill-lem',   dashPath: '/catalyst' },
}

const NAV_LINKS = [
  { label: 'Dashboard', matchFn: p => ['/seeker','/sage','/catalyst'].includes(p), path: null },
  { label: 'Explore',   matchFn: p => p === '/explore',  path: '/explore'  },
  { label: 'My swaps',  matchFn: p => p === '/swaps',    path: '/swaps'    },
  { label: 'Progress',  matchFn: p => p === '/progress', path: '/progress' },
  { label: 'Messages',  matchFn: p => p === '/messages', path: '/messages' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { profile } = useUser()
  const location = useLocation()
  const navigate = useNavigate()

  const roleConf = ROLE_CONFIG[profile.role] || ROLE_CONFIG.seeker
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  function handleDashboard() {
    navigate(roleConf.dashPath)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: '56px', background: '#fff',
      borderBottom: '0.5px solid var(--lav-100)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <Link to={roleConf.dashPath} style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '17px', fontWeight: 500, color: 'var(--lav-600)', letterSpacing: '-0.3px' }}>
          skill<span style={{ color: 'var(--mint-600)' }}>swap</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {NAV_LINKS.map(link => {
          const isActive = link.matchFn(location.pathname)
          return (
            <button
              key={link.label}
              onClick={() => link.path ? navigate(link.path) : handleDashboard()}
              style={{
                fontSize: '13px', padding: '6px 14px', borderRadius: '20px',
                border: 'none', cursor: 'pointer', transition: 'background .15s',
                background: isActive ? 'var(--lav-50)' : 'transparent',
                color: isActive ? 'var(--lav-600)' : '#666',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {link.label}
            </button>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className={`pill ${roleConf.pillClass}`}>{roleConf.label}</span>

        {/* Notification bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/messages')}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--lem-50)', border: '0.5px solid var(--lem-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
          }}>🔔</div>
          <div style={{
            position: 'absolute', top: '5px', right: '5px',
            width: '7px', height: '7px', background: '#E24B4A',
            borderRadius: '50%', border: '1.5px solid #fff',
          }} />
        </div>

        {/* Avatar + logout */}
        <div style={{ position: 'relative' }}>
          <div
            title="Click to go to settings"
            onClick={() => navigate('/settings')}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--lav-200)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 500, color: 'var(--lav-600)', cursor: 'pointer',
            }}
          >
            {initials}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            fontSize: '12px', padding: '5px 12px', borderRadius: '20px',
            border: '0.5px solid var(--lav-100)', background: 'transparent',
            color: '#888', cursor: 'pointer',
          }}
        >
          Log out
        </button>
      </div>
    </nav>
  )
}
