import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollReveal, useHeroReveal } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

export default function AboutPage() {
  useHeroReveal()
  useScrollReveal()

  const { isAuthenticated } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section
        className="hero-gradient text-center"
        style={{ padding: '6rem 2rem' }}
      >
        <h1
          className="font-extrabold"
          style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text)' }}
        >
          Built to make <span style={{ color: 'var(--purple)' }}>learning</span> accessible
        </h1>

        <p style={{ maxWidth: '600px', margin: '1rem auto', color: 'var(--text2)' }}>
          Everyone has something to teach and something to learn.
        </p>
      </section>

      {/* Mission */}
      <section className="p-10">
        <h2 className="text-xl font-bold mb-4">Our Mission</h2>
        <p>
          Remove financial barriers from learning and enable peer-to-peer skill exchange.
        </p>
      </section>

      {/* Features */}
      <section className="p-10 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Features</h2>

        <ul className="space-y-2">
          <li>🤝 Skill matching</li>
          <li>💬 Chat system</li>
          <li>📅 Scheduling</li>
          <li>⭐ Reviews</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="p-10 text-center">
        <h2 className="text-xl font-bold mb-4">
          Ready to start?
        </h2>

        <Link to={isAuthenticated ? "/explore" : "/register"}>
          <button className="bg-purple-600 text-white px-6 py-3 rounded">
            Get Started 🚀
          </button>
        </Link>

        <div className="mt-3">
          <Link to={isAuthenticated ? "/explore" : "/login"}>
            Browse Skills
          </Link>
        </div>
      </section>
    </div>
  )
}