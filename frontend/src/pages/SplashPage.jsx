import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollReveal, useHeroReveal } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

export default function SplashPage() {
  useHeroReveal()
  useScrollReveal()

  const { isAuthenticated } = useAuth()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section
        className="hero-gradient flex items-center justify-center text-center"
        style={{ minHeight: 'calc(100vh - 64px)', padding: '4rem 2rem' }}
      >
        <div style={{ maxWidth: '650px' }}>

          <h1
            className="font-extrabold"
            style={{
              fontSize: 'clamp(2.5rem,5vw,3.5rem)',
              color: 'var(--purple)'
            }}
          >
            Share Skills, Grow Together
          </h1>

          <p style={{ marginTop: '1rem', color: 'var(--text2)' }}>
            Connect with people who want to learn what you know, and teach you what they excel at.
          </p>

          {/* CTA */}
          <div className="flex gap-3 justify-center mt-6 flex-wrap">

            <Link to={isAuthenticated ? "/explore" : "/register"}>
              <button className="bg-purple-600 text-white px-6 py-3 rounded">
                Get Started →
              </button>
            </Link>

            <Link to={isAuthenticated ? "/explore" : "/login"}>
              <button className="border px-6 py-3 rounded">
                Explore Skills
              </button>
            </Link>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            'Create Profile',
            'Find Match',
            'Start Learning'
          ].map((step, i) => (
            <div key={i} className="border p-6 rounded">
              <h3 className="font-semibold mb-2">{step}</h3>
              <p className="text-sm text-gray-500">
                Simple and fast process
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="p-10 text-center">
        <h2 className="text-xl font-bold mb-3">
          Ready to start?
        </h2>

        <Link to="/register">
          <button className="bg-purple-600 text-white px-6 py-3 rounded">
            Join Now 🚀
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="p-6 text-center text-sm text-gray-500">
        © 2026 SkillSwap
      </footer>
    </div>
  )
}