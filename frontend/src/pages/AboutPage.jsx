import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollReveal, useHeroReveal } from '../hooks/useTheme'

// LoginPage
const { handleLogin, loading, error } = useAuthActions()
await handleLogin(email, password)

export default function AboutPage() {
  useHeroReveal()
  useScrollReveal()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient relative text-center overflow-hidden"
        style={{ padding: '6rem 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '350px', height: '350px', background: 'radial-gradient(circle,rgba(124,58,237,0.1),transparent 70%)', pointerEvents: 'none' }} />
        <div className="hero-reveal eyebrow" style={{ marginBottom: '1.25rem' }}>Our Story</div>
        <h1 className="hero-reveal font-extrabold leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text)', marginBottom: '1rem', transitionDelay: '0.1s' }}>
          Built to make <span style={{ color: 'var(--purple)' }}>learning</span><br />accessible for everyone
        </h1>
        <p className="hero-reveal" style={{ color: 'var(--text2)', maxWidth: '560px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.75, transitionDelay: '0.2s' }}>
          SkillSwap was born from a simple belief — everyone has something valuable to teach, and everyone has something they want to learn. We built the bridge.
        </p>
      </section>

      {/* Mission */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
          className="grid grid-cols-1 md:grid-cols-2">
          <div className="reveal-left">
            <div className="rounded-3xl flex items-center justify-center" style={{ background: 'var(--purple-light)', aspectRatio: '4/3' }}>
              <div className="text-center">
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⇄</div>
                <div className="flex items-center gap-3 justify-center mb-3">
                  <span className="font-semibold rounded-full px-4 py-2 text-sm" style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', color: 'var(--purple)' }}>Python</span>
                  <span style={{ color: 'var(--purple)', fontSize: '1.2rem' }}>⇄</span>
                  <span className="font-semibold rounded-full px-4 py-2 text-sm" style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', color: 'var(--purple)' }}>Guitar</span>
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--purple)' }}>Skills, not money</p>
              </div>
            </div>
          </div>
          <div className="reveal-right">
            <div className="eyebrow mb-4">Our Mission</div>
            <h2 className="font-extrabold mb-4 leading-snug" style={{ fontSize: '1.75rem', color: 'var(--text)' }}>
              Knowledge is the only currency that grows when you spend it
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text2)' }}>
              We are on a mission to democratize learning by removing financial barriers. On SkillSwap, you teach what you know and learn what you want — through direct, human-to-human exchanges.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              Whether you are a student in Prayagraj wanting to learn guitar, or a musician in Mumbai looking to pick up coding — SkillSwap connects you instantly with the perfect partner.
            </p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: '5rem 2rem', background: 'var(--bg3)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div className="eyebrow reveal mb-3">The Problem We Solve</div>
          <h2 className="reveal font-extrabold mb-8" style={{ fontSize: '1.75rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            Learning should not require a credit card
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
            {[
              { icon: '💸', bg: 'var(--purple-light)', title: 'Courses are expensive',      desc: 'Quality education on platforms like Udemy costs thousands. Most people cannot afford it consistently.' },
              { icon: '🌍', bg: '#EFF6FF',             title: 'Local tutors are hard to find', desc: 'Finding a reliable teacher for a niche skill is time-consuming, uncertain, and often out of reach.' },
              { icon: '🤝', bg: '#D1FAE5',             title: 'Knowledge goes unused',     desc: 'Millions have valuable skills — photography, cooking, coding — that never get shared with others.' },
            ].map(c => (
              <div key={c.title} className="ss-card reveal p-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: c.bg }}>{c.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div className="eyebrow reveal mb-3">What We Built</div>
          <h2 className="reveal font-extrabold mb-8" style={{ fontSize: '1.75rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            Every feature designed for real exchanges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
            {[
              { icon: '🤝', bg: 'var(--purple-light)', title: 'Smart skill matching',    desc: 'Bidirectional algorithm finds users who want what you offer and offer what you want.' },
              { icon: '📅', bg: '#EFF6FF',             title: 'Session scheduling',      desc: 'Book video, audio, or in-person sessions with conflict detection and reminders.' },
              { icon: '⭐', bg: '#FEF3C7',             title: 'Peer endorsements',        desc: 'Swap partners endorse your skills — building verified reputation over time.' },
              { icon: '🔒', bg: '#D1FAE5',             title: 'Trust and safety',         desc: 'Identity verification badges, dispute resolution, and a community reporting system.' },
              { icon: '💬', bg: '#FCE7F3',             title: 'Real-time chat',          desc: 'In-swap messaging with Socket.io, typing indicators, and persistent history.' },
              { icon: '📣', bg: '#E0E7FF',             title: 'Community feed',          desc: 'Share skill posts, celebrate swap milestones, ask questions, discover new skills.' },
            ].map(f => (
              <div key={f.title} className="reveal ss-card p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: f.bg }}>{f.icon}</div>
                <div>
                  <h3 className="font-bold mb-1 text-sm" style={{ color: 'var(--text)' }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '5rem 2rem', background: 'var(--purple-light)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow reveal mb-3">Tech Stack</div>
          <h2 className="reveal font-extrabold mb-8" style={{ fontSize: '1.75rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            Built with production-grade tools
          </h2>
          <div className="flex flex-wrap gap-3 justify-center reveal">
            {[
              ['React 19', '#61DAFB'], ['Tailwind CSS', '#38BDF8'], ['Vite', '#F97316'],
              ['Node.js', '#68A063'], ['Express.js', '#111827'], ['MongoDB', '#47A248'],
              ['Socket.io', '#010101'], ['JWT Auth', '#D53F8C'], ['Nodemailer', '#E74C3C'],
              ['React Router v7', '#8B5CF6'], ['node-cron', '#2496ED'], ['Google OAuth', '#4285F4'],
            ].map(([name, dot]) => (
              <span key={name} className="flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-xl"
                style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '5rem 2rem', background: 'var(--bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div className="eyebrow reveal mb-3">The Team</div>
          <h2 className="reveal font-extrabold mb-3" style={{ fontSize: '1.75rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            Built by students, for learners everywhere
          </h2>
          <p className="reveal mb-10" style={{ color: 'var(--text2)', transitionDelay: '0.15s' }}>
            This project was built as a full-stack capstone — combining a React frontend and a Node.js backend.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger" style={{ maxWidth: '560px', margin: '0 auto' }}>
            {[
              { initial: 'M', bg: 'var(--purple-light)', color: 'var(--purple)', name: 'Manavi',         role: 'Backend Developer', desc: 'Built the Node.js + Express backend — REST APIs, MongoDB models, Socket.io, JWT auth, email notifications, and all business logic.' },
              { initial: 'S', bg: '#EFF6FF',             color: '#1D4ED8',       name: 'SinghManavi-99', role: 'Frontend Developer', desc: 'Designed and built the React 19 frontend — routing, Tailwind UI, context management, and all 15+ pages of the user experience.' },
            ].map(t => (
              <div key={t.name} className="ss-card reveal p-7 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4"
                  style={{ background: t.bg, color: t.color }}>{t.initial}</div>
                <h3 className="font-bold" style={{ color: 'var(--text)' }}>{t.name}</h3>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--purple)' }}>{t.role}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 2rem', background: 'var(--purple)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', textAlign: 'center' }}>
          {[['15+', 'Pages & Routes'], ['12', 'Database Models'], ['50+', 'API Endpoints'], ['3', 'User Roles']].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl font-extrabold text-white">{n}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,var(--purple),var(--purple-mid),#EC4899)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 className="font-extrabold text-white mb-2" style={{ fontSize: '1.75rem' }}>Ready to start swapping?</h2>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,0.85)' }}>Join the community and exchange skills — for free.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <button className="font-bold rounded-xl px-7 py-3 text-sm transition-all" style={{ background: '#fff', color: '#111827', border: 'none' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={e  => e.currentTarget.style.transform = 'none'}>
              Get Started Free →
            </button>
          </Link>
          <Link to="/explore">
            <button className="font-bold rounded-xl px-7 py-3 text-sm text-white transition-all"
              style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseOut={e  => e.currentTarget.style.background = 'transparent'}>
              Browse Skills
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}