import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useScrollReveal, useHeroReveal } from '../hooks/useTheme'

export default function SplashPage() {
  useHeroReveal()
  useScrollReveal()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO — Full viewport ── */}
      <section className="hero-gradient relative flex items-center justify-center text-center overflow-hidden"
        style={{ minHeight: 'calc(100vh - 64px)', padding: '5rem 2rem', position: 'relative' }}>

        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '420px', height: '420px', background: 'radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle,rgba(236,72,153,0.07),transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>

          <div className="eyebrow hero-reveal" style={{ marginBottom: '1.5rem' }}>
            🌟 Peer-to-Peer Learning Platform
          </div>

          <h1 className="hero-reveal font-extrabold leading-tight"
            style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'var(--purple)', marginBottom: '1.25rem', transitionDelay: '0.1s' }}>
            Share Skills,<br />Grow Together
          </h1>

          <p className="hero-reveal" style={{ fontSize: '1.05rem', color: 'var(--text2)', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto 2.5rem', transitionDelay: '0.2s' }}>
            Connect with people who want to learn what you know, and teach you what they excel at.
            No money needed — just passion and time.
          </p>

          <div className="hero-reveal flex gap-3 justify-center flex-wrap" style={{ marginBottom: '3.5rem', transitionDelay: '0.3s' }}>
            <Link to="/register">
              <button className="font-bold rounded-xl transition-all duration-200 flex items-center gap-2"
                style={{ background: 'var(--purple)', color: '#fff', fontSize: '0.975rem', padding: '13px 28px', border: 'none' }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--purple-dark)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={e  => { e.currentTarget.style.background = 'var(--purple)';      e.currentTarget.style.transform = 'none' }}>
                Get Started Free →
              </button>
            </Link>
            <Link to="/explore">
              <button className="font-bold rounded-xl transition-all duration-200"
                style={{ background: 'var(--card-bg)', color: 'var(--text)', fontSize: '0.975rem', padding: '12px 28px', border: '1.5px solid var(--border2)' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple)' }}
                onMouseOut={e  => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)' }}>
                Explore Skills
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-reveal flex gap-10 justify-center flex-wrap" style={{ transitionDelay: '0.4s' }}>
            {[
              { icon: '👥', num: '10,000+', lbl: 'Active Members' },
              { icon: '📈', num: '50,000+', lbl: 'Skills Exchanged' },
              { icon: '🌍', num: '100+',    lbl: 'Countries' },
            ].map(s => (
              <div key={s.lbl} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  {s.icon}
                </div>
                <div>
                  <div className="font-extrabold text-lg leading-tight" style={{ color: 'var(--text)' }}>{s.num}</div>
                  <div className="text-xs" style={{ color: 'var(--text3)', marginTop: '2px' }}>{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint absolute flex flex-col items-center gap-1.5 cursor-pointer"
          style={{ bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{ border: '1.5px solid var(--border2)', color: 'var(--text3)' }}>↓</div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow reveal">Process</div>
          <h2 className="reveal font-extrabold mt-3 mb-2" style={{ fontSize: '1.9rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            How SkillSwap Works
          </h2>
          <p className="reveal mb-12" style={{ color: 'var(--text3)', transitionDelay: '0.15s' }}>
            Start exchanging skills in three simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 stagger">
            {[
              { n: '1', bg: '#EFF6FF',             color: '#3B82F6', title: 'Create Your Profile',  desc: 'List skills you can teach and what you want to learn. Showcase your expertise.' },
              { n: '2', bg: 'var(--purple-light)', color: 'var(--purple)', title: 'Find Your Match', desc: 'Our algorithm matches users who want what you offer and offer what you want.' },
              { n: '3', bg: '#FDF2F8',             color: '#EC4899', title: 'Start Learning',       desc: 'Schedule sessions, exchange knowledge, and grow together. Simple!' },
            ].map(s => (
              <div key={s.n} className="reveal flex flex-col items-center">
                <div className="rounded-full flex items-center justify-center font-extrabold text-3xl mb-5"
                  style={{ width: 72, height: 72, background: s.bg, color: s.color }}>
                  {s.n}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SKILLS ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow reveal">Discover</div>
          <h2 className="reveal font-extrabold mt-3 mb-2" style={{ fontSize: '1.9rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            Featured Skills
          </h2>
          <p className="reveal mb-10" style={{ color: 'var(--text3)', transitionDelay: '0.15s' }}>
            Thousands of skills waiting to be exchanged
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 stagger">
            {[
              { emoji: '🎸', bg: 'linear-gradient(135deg,#EDE9FE,#C4B5FD)', cat: 'Music',      cc: '#7C3AED', title: 'Guitar Lessons',     meta: 'Expert · Flexible',   av: 'AR', avBg: '#EDE9FE', avC: '#7C3AED', name: 'Alex R.',   r: '4.9', id: '' },
              { emoji: '💻', bg: 'linear-gradient(135deg,#DBEAFE,#93C5FD)', cat: 'Technology', cc: '#3B82F6', title: 'Python Programming', meta: 'Intermediate · 2hrs', av: 'PS', avBg: '#DBEAFE', avC: '#2563EB', name: 'Priya S.', r: '4.8', id: '' },
              { emoji: '🎨', bg: 'linear-gradient(135deg,#FCE7F3,#F9A8D4)', cat: 'Design',     cc: '#EC4899', title: 'UI/UX Design',       meta: 'Beginner · Flexible', av: 'NK', avBg: '#FCE7F3', avC: '#DB2777', name: 'Neha K.',  r: '5.0', id: '' },
              { emoji: '🗣️', bg: 'linear-gradient(135deg,#D1FAE5,#6EE7B7)', cat: 'Language',   cc: '#10B981', title: 'French Lessons',     meta: 'Beginner · 45 mins',  av: 'SM', avBg: '#D1FAE5', avC: '#059669', name: 'Sophie M.',r: '4.7', id: '' },
              { emoji: '🍳', bg: 'linear-gradient(135deg,#FEF3C7,#FCD34D)', cat: 'Cooking',    cc: '#F59E0B', title: 'Indian Cuisine',      meta: 'All Levels · 2hrs',   av: 'RG', avBg: '#FEF3C7', avC: '#B45309', name: 'Ravi G.', r: '4.9', id: '' },
              { emoji: '📐', bg: 'linear-gradient(135deg,#E0E7FF,#A5B4FC)', cat: 'Academic',   cc: '#6366F1', title: 'DSA Mastery',        meta: 'Intermediate · 1.5hr',av: 'AK', avBg: '#E0E7FF', avC: '#4338CA', name: 'Arjun K.',r: '4.8', id: '' },
            ].map(s => (
              <Link key={s.title} to="/explore" className="reveal ss-card ss-card-hover text-left overflow-hidden block">
                <div className="flex items-center justify-center text-5xl" style={{ height: '148px', background: s.bg }}>
                  {s.emoji}
                </div>
                <div style={{ padding: '1.1rem' }}>
                  <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: s.cc }}>{s.cat}</div>
                  <div className="font-bold mb-1" style={{ color: 'var(--text)' }}>{s.title}</div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text3)' }}>{s.meta}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: s.avBg, color: s.avC }}>{s.av}</div>
                      <span className="text-xs font-medium" style={{ color: 'var(--text2)' }}>{s.name}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>★ {s.r}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 reveal">
            <Link to="/explore"><button className="btn-outline px-8 py-3">Browse All Skills →</button></Link>
          </div>
        </div>
      </section>

      {/* ── WHY SKILLSWAP ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow reveal">Benefits</div>
          <h2 className="reveal font-extrabold mt-3 mb-12" style={{ fontSize: '1.9rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            Why Choose SkillSwap?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
            {[
              { bg: '#EFF6FF',             icon: '👥', title: 'Community Driven', desc: 'Join a supportive community of learners and teachers from around the world.' },
              { bg: 'var(--purple-light)', icon: '🛡️', title: 'Safe & Secure',   desc: 'Verified profiles, ratings, reviews, and dispute resolution keep you safe.' },
              { bg: '#FDF2F8',             icon: '⚡', title: '100% Free',       desc: 'No hidden fees, no subscriptions. Pure skill exchange based on mutual benefit.' },
              { bg: '#D1FAE5',             icon: '📅', title: 'Easy Scheduling', desc: 'Book video, audio or in-person sessions. Reminders sent automatically.' },
              { bg: '#FEF3C7',             icon: '⭐', title: 'Build Reputation', desc: 'Peer endorsements and ratings grow your verified skill profile over time.' },
              { bg: '#FCE7F3',             icon: '💬', title: 'Real-time Chat',  desc: 'In-swap messaging with typing indicators keeps coordination effortless.' },
            ].map(c => (
              <div key={c.title} className="reveal ss-card ss-card-hover p-8 text-left">
                <div className="rounded-2xl flex items-center justify-center text-2xl mb-5 flex-shrink-0"
                  style={{ width: 54, height: 54, background: c.bg }}>
                  {c.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow reveal">Stories</div>
          <h2 className="reveal font-extrabold mt-3 mb-2" style={{ fontSize: '1.9rem', color: 'var(--text)', transitionDelay: '0.1s' }}>
            What Our Community Says
          </h2>
          <p className="reveal mb-10" style={{ color: 'var(--text3)', transitionDelay: '0.15s' }}>Real people, real exchanges</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
            {[
              { av: 'AK', avBg: '#EDE9FE', avC: '#7C3AED', name: 'Arjun Kumar',  role: 'Developer, Delhi',     quote: '"I taught Python to a musician and learned guitar in return. SkillSwap made something I thought impossible completely real."' },
              { av: 'NK', avBg: '#FCE7F3', avC: '#DB2777', name: 'Neha Kumar',   role: 'Designer, Mumbai',     quote: '"Found a French teacher within 2 days. We swap design lessons weekly. This platform is genuinely life-changing."' },
              { av: 'PS', avBg: '#D1FAE5', avC: '#059669', name: 'Priya Sharma', role: 'CS Student, Bangalore', quote: '"As a student I cannot afford courses. SkillSwap lets me trade what I know for what I need. It is the future of learning."' },
            ].map(t => (
              <div key={t.name} className="reveal ss-card p-7 text-left">
                <div className="text-sm font-bold mb-3" style={{ color: 'var(--amber)' }}>★★★★★</div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--text2)' }}>{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ background: t.avBg, color: t.avC }}>{t.av}</div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text3)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div className="reveal-scale rounded-3xl p-20 text-center"
            style={{ background: 'linear-gradient(135deg,var(--purple) 0%,var(--purple-mid) 50%,#EC4899 100%)' }}>
            <h2 className="font-extrabold text-white mb-2" style={{ fontSize: '2rem' }}>
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Join thousands of people exchanging skills and growing together — for free.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/register">
                <button className="font-bold rounded-xl px-7 py-3 text-sm transition-all"
                  style={{ background: '#fff', color: '#111827', border: 'none' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseOut={e  => e.currentTarget.style.transform = 'none'}>
                  Sign Up Free
                </button>
              </Link>
              <Link to="/explore">
                <button className="font-bold rounded-xl px-7 py-3 text-sm text-white transition-all"
                  style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={e  => e.currentTarget.style.background = 'transparent'}>
                  Browse Skills
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--bg3)', borderTop: '1px solid var(--border)', padding: '4rem 2rem 2rem' }}>
        <div className="reveal" style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'var(--purple)' }}>S</div>
                <span className="font-bold" style={{ color: 'var(--text)' }}>SkillSwap</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text3)' }}>
                Exchange skills, grow together, and build meaningful connections across the world.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Explore Skills', 'How It Works', 'Success Stories'] },
              { title: 'Support',  links: ['Help Center', 'Safety', 'Community Guidelines'] },
              { title: 'Company',  links: ['About Us', 'Contact', 'Privacy Policy'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>{col.title}</h4>
                {col.links.map(l => (
                  <div key={l} className="text-xs mb-2 cursor-pointer transition-colors"
                    style={{ color: 'var(--text3)' }}
                    onMouseOver={e => e.target.style.color = 'var(--purple)'}
                    onMouseOut={e  => e.target.style.color = 'var(--text3)'}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="text-center text-xs pt-6" style={{ color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
            © 2026 SkillSwap. All rights reserved. Built with ❤️ for learners everywhere.
          </div>
        </div>
      </footer>
    </div>
  )
}