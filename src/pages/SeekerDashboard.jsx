import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MentorCard from '../components/MentorCard'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { MENTORS, TRENDING_SKILLS, SKILL_PATHS } from '../data/Mockdata'
import { sortMentorsByMatch, getMatchedSkills } from '../utils/MatchScore'

const COLOR_STYLES = {
  lav:   { bg: 'var(--lav-50)',   text: 'var(--lav-600)',   bar: 'var(--lav-600)'   },
  mint:  { bg: 'var(--mint-50)',  text: 'var(--mint-600)',  bar: 'var(--mint-600)'  },
  peach: { bg: 'var(--peach-50)', text: 'var(--peach-600)', bar: 'var(--peach-600)' },
  lem:   { bg: 'var(--lem-50)',   text: 'var(--lem-600)',   bar: 'var(--lem-600)'   },
  sky:   { bg: 'var(--sky-50)',   text: 'var(--sky-600)',   bar: 'var(--sky-600)'   },
  pink:  { bg: '#FBE8F5',         text: '#8A1A5E',          bar: '#8A1A5E'          },
}

export default function SeekerDashboard() {
  const { profile } = useUser()
  const { user } = useAuth()
  const navigate = useNavigate()

  const sortedMentors = sortMentorsByMatch(MENTORS, profile.skillsWanted, profile.skillsOffered)
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--surf)' }}>
      <Navbar />

      <div style={{ display: 'flex', gap: '18px', padding: '20px 24px 32px', alignItems: 'flex-start' }}>

        {/* ── Sidebar: Mentor list ── */}
        <aside style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p className="section-label">Matched mentors</p>

          {sortedMentors.map(mentor => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              matchScore={mentor.matchScore}
              matchedSkills={getMatchedSkills(profile.skillsWanted, mentor.skillsOffered)}
              compact
            />
          ))}

          <button className="btn-ghost" style={{ width: '100%', fontSize: '12px', padding: '8px' }}
            onClick={() => navigate('/explore')}>
            View all mentors →
          </button>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

          {/* Welcome bar */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Good morning, {firstName} 🌤</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>
                You have 2 pending swap requests and 1 session today.
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--lem-50)', border: '0.5px solid var(--lem-200)',
              borderRadius: '20px', padding: '6px 14px',
              fontSize: '12px', fontWeight: 500, color: 'var(--lem-600)',
            }}>
              <span style={{ fontSize: '15px' }}>🔥</span>
              12-day streak
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '10px' }}>
            {[
              { label: 'Skills learning', val: profile.skillsWanted.length || 5, sub: '+2 this month',  color: 'var(--lav-600)' },
              { label: 'Active swaps',    val: 3,                                 sub: '1 session today', color: 'var(--mint-600)' },
              { label: 'XP earned',       val: '1,240',                           sub: 'Level 6 Seeker', color: 'var(--lem-600)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 500, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: s.color, marginTop: '2px' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Trending skills */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Trending skills</span>
              <span className="pill pill-peach" style={{ fontSize: '10px' }}>Not in your list</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '8px' }}>
              {TRENDING_SKILLS.map(skill => {
                const c = COLOR_STYLES[skill.color] || COLOR_STYLES.lav
                return (
                  <div key={skill.id}
                    onClick={() => navigate('/explore')}
                    style={{
                      background: c.bg, borderRadius: '12px', padding: '10px 12px',
                      cursor: 'pointer', transition: 'opacity .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 500, color: c.text }}>{skill.name}</div>
                    <div style={{ fontSize: '11px', color: c.text, opacity: .7, marginTop: '2px' }}>
                      {skill.learners.toLocaleString()} seekers learning
                    </div>
                    <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(0,0,0,.1)', marginTop: '8px' }}>
                      <div style={{ height: '3px', borderRadius: '2px', background: c.bar, width: `${skill.pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Skill paths */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Recommended skill paths</span>
              <span className="pill pill-lav" style={{ fontSize: '10px' }}>Curated for you</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SKILL_PATHS.map(path => (
                <div key={path.id}
                  onClick={() => navigate(`/path/${path.id}`)}
                  style={{
                    border: '0.5px solid var(--lav-100)', borderRadius: '12px',
                    padding: '12px 14px', cursor: 'pointer', transition: 'border-color .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--lav-200)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--lav-100)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{path.name}</span>
                    <span style={{ fontSize: '11px', color: '#888' }}>{path.duration}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {path.steps.map(step => (
                      <span key={step.name} className={`pill pill-${step.color}`} style={{ fontSize: '10px' }}>
                        {step.name}
                      </span>
                    ))}
                  </div>

                  <div style={{ height: '5px', borderRadius: '3px', background: 'var(--lav-50)' }}>
                    <div style={{ height: '5px', borderRadius: '3px', background: 'var(--lav-600)', width: `${path.progress}%`, transition: 'width .4s' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '7px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: path.progress > 0 ? 'var(--lav-600)' : '#aaa' }}>
                      {path.progress > 0 ? `${path.progress}% complete` : 'Not started'}
                    </span>
                    <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px' }}
                      onClick={e => { e.stopPropagation(); navigate(`/path/${path.id}`) }}>
                      {path.progress > 0 ? 'Continue →' : 'Start path →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
