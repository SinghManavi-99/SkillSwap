import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAuthActions } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const { handleLogout } = useAuthActions()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="nav-sticky">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-base"
          style={{ background: 'var(--purple)' }}
        >
          S
        </div>
        <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>
          SkillSwap
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-0.5 flex-1 pl-2">
        <Link to="/">
          <button className={`nav-link-btn ${isActive('/') ? 'active' : ''}`}>Home</button>
        </Link>
        <Link to="/explore">
          <button className={`nav-link-btn ${isActive('/explore') ? 'active' : ''}`}>Explore</button>
        </Link>
        <Link to="/about">
          <button className={`nav-link-btn ${isActive('/about') ? 'active' : ''}`}>About</button>
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/swaps">
              <button className={`nav-link-btn ${isActive('/swaps') ? 'active' : ''}`}>My Swaps</button>
            </Link>
            <Link to="/community">
              <button className={`nav-link-btn ${isActive('/community') ? 'active' : ''}`}>Community</button>
            </Link>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">

        {/* 🌙 Dark/Light toggle */}
        <ThemeToggle />

        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              <button className="btn-ghost text-sm">Dashboard</button>
            </Link>
            <Link to="/settings">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                style={{
                  background: 'var(--purple-light)',
                  color: 'var(--purple)',
                }}
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm transition-colors"
              style={{ color: 'var(--text3)' }}
              onMouseOver={e => e.target.style.color = '#EF4444'}
              onMouseOut={e => e.target.style.color = 'var(--text3)'}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/explore">
              <button className="btn-ghost text-sm">⊙ Browse Skills</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary">Get Started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}