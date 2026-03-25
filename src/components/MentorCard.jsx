import { useNavigate } from 'react-router-dom'

const COLOR_MAP = {
  mint:  { bg: 'var(--mint-50)',  text: 'var(--mint-600)',  border: 'var(--mint-200)'  },
  lav:   { bg: 'var(--lav-50)',   text: 'var(--lav-600)',   border: 'var(--lav-200)'   },
  peach: { bg: 'var(--peach-50)', text: 'var(--peach-600)', border: 'var(--peach-200)' },
  sky:   { bg: 'var(--sky-50)',   text: 'var(--sky-600)',   border: 'var(--sky-200)'   },
  lem:   { bg: 'var(--lem-50)',   text: 'var(--lem-600)',   border: 'var(--lem-200)'   },
}

export default function MentorCard({ mentor, matchScore, matchedSkills = [], compact = false }) {
  const navigate = useNavigate()
  const c = COLOR_MAP[mentor.color] || COLOR_MAP.lav

  return (
    <div
      onClick={() => navigate(`/mentor/${mentor.id}`)}
      style={{
        background: '#fff', borderRadius: '14px', border: '0.5px solid var(--lav-100)',
        padding: compact ? '12px' : '14px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        cursor: 'pointer', transition: 'border-color .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--lav-200)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--lav-100)'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: compact ? '36px' : '40px', height: compact ? '36px' : '40px',
          borderRadius: '50%', background: c.bg, color: c.text,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 500, flexShrink: 0,
          border: `1.5px solid ${c.border}`,
        }}>
          {mentor.initials}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{mentor.name}</div>
          <div style={{ fontSize: '11px', color: '#888' }}>{mentor.title} · {mentor.experience}</div>
        </div>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {mentor.skillsOffered.slice(0, 4).map(skill => {
          const isMatch = matchedSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
          return (
            <span
              key={skill}
              className={`pill ${isMatch ? 'pill-lem' : 'pill-lav'}`}
              style={{ fontSize: '10px' }}
            >
              {isMatch && <span style={{ marginRight: '3px' }}>✦</span>}
              {skill}
            </span>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: '#D4A000' }}>
          {'★'.repeat(Math.floor(mentor.rating))}
          {'☆'.repeat(5 - Math.floor(mentor.rating))}
          <span style={{ color: '#111', marginLeft: '4px', fontWeight: 500 }}>{mentor.rating}</span>
        </span>
        {matchScore != null && (
          <span className="pill pill-mint" style={{ fontSize: '10px' }}>
            {matchScore}% match
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        className="btn-secondary"
        style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '10px' }}
        onClick={e => { e.stopPropagation(); navigate(`/mentor/${mentor.id}`) }}
      >
        Request swap
      </button>
    </div>
  )
}
