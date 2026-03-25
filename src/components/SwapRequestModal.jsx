import { useState } from 'react'
import { useUser } from '../context/UserContext'

export default function SwapRequestModal({ mentor, onClose, onSubmit }) {
  const { profile } = useUser()
  const [offerSkill, setOfferSkill]   = useState(profile.skillsOffered[0] || '')
  const [wantSkill, setWantSkill]     = useState(mentor.skillsOffered[0] || '')
  const [sessions, setSessions]       = useState(4)
  const [message, setMessage]         = useState('')
  const [submitted, setSubmitted]     = useState(false)

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => { onSubmit?.(); onClose() }, 1500)
  }

  return (
    <div style={{
      minHeight: '420px', background: 'rgba(60,40,120,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '20px', padding: '24px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', border: '0.5px solid var(--lav-100)',
        padding: '24px', width: '100%', maxWidth: '420px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>Swap request sent!</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
              {mentor.name} will respond within {mentor.replyTime}.
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>Request a swap</div>
              <button onClick={onClose} style={{
                background: 'none', border: 'none', fontSize: '18px', color: '#888', cursor: 'pointer',
              }}>✕</button>
            </div>

            {/* Mentor */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--surf)', borderRadius: '12px', padding: '10px 12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--mint-50)', color: 'var(--mint-600)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 500,
              }}>{mentor.initials}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{mentor.name}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{mentor.title}</div>
              </div>
            </div>

            {/* I will teach */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--lav-600)', display: 'block', marginBottom: '6px' }}>
                I will teach
              </label>
              <select
                className="input-base"
                value={offerSkill}
                onChange={e => setOfferSkill(e.target.value)}
              >
                {profile.skillsOffered.length
                  ? profile.skillsOffered.map(s => <option key={s}>{s}</option>)
                  : <option value="">No skills added yet</option>
                }
              </select>
            </div>

            {/* I want to learn */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--mint-600)', display: 'block', marginBottom: '6px' }}>
                I want to learn
              </label>
              <select
                className="input-base"
                value={wantSkill}
                onChange={e => setWantSkill(e.target.value)}
              >
                {mentor.skillsOffered.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Sessions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#111' }}>Number of sessions each</label>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--lav-600)' }}>{sessions}</span>
              </div>
              <input type="range" min="1" max="12" step="1" value={sessions}
                onChange={e => setSessions(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#aaa' }}>
                <span>1</span><span>12</span>
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#111', display: 'block', marginBottom: '6px' }}>
                Short intro message
              </label>
              <textarea
                className="input-base"
                rows={3}
                placeholder={`Hi ${mentor.name.split(' ')[0]}, I'd love to swap skills with you...`}
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '12px' }} onClick={handleSubmit}>
              Send swap request
            </button>
          </>
        )}
      </div>
    </div>
  )
}
