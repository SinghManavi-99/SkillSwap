import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useUserProfile, useScrollReveal } from '../hooks'
import { useSendSwap } from '../hooks/useSwaps'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

export default function MentorProfilePage() {
  const { id } = useParams()
  const { user }    = useAuth()
  const { profile } = useUser()
  const { user: mentor, reviews, average, loading, error } = useUserProfile(id)
  const { sendSwap, loading: sending, success, error: swapErr } = useSendSwap()
  const [msg, setMsg] = useState('')
  useScrollReveal()

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }}><Navbar /><div className="max-w-4xl mx-auto px-6 py-8 animate-pulse"><div className="h-48 rounded-2xl mb-6" style={{ background: 'var(--border)' }} /></div></div>
  if (!mentor) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }}><Navbar /><p className="text-center py-20" style={{ color: 'var(--text3)' }}>User not found.</p></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '1.5rem 2rem 4rem' }}>
        <Link to="/explore" className="text-sm flex items-center gap-1 mb-6 hover:underline" style={{ color: 'var(--text3)' }}>← Back to Explore</Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">
            {/* Profile header */}
            <div className="reveal ss-card p-6 flex items-start gap-5" style={{ background: 'linear-gradient(135deg,var(--bg2),var(--bg3))' }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0" style={{ background: 'var(--purple)', color: '#fff' }}>
                {mentor.avatar ? <img src={mentor.avatar} alt="" className="w-full h-full object-cover rounded-2xl" /> : mentor.name?.[0]}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>{mentor.name}</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>{mentor.location?.city || 'Location not set'}</p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text2)' }}>{mentor.bio || 'No bio yet.'}</p>
                <div className="flex gap-4 mt-3 text-sm" style={{ color: 'var(--text3)' }}>
                  <span>⭐ {average || 0} avg</span>
                  <span>🔄 {mentor.totalSwapsCompleted || 0} swaps</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            {[['Skills Offered', mentor.skillsOffered, 'var(--purple-light)', 'var(--purple)'], ['Looking to Learn', mentor.skillsWanted, 'var(--bg3)', 'var(--text2)']].map(([title, skills, bg, color]) => (
              <div key={title} className="reveal ss-card p-5">
                <h2 className="font-bold mb-3" style={{ color: 'var(--text)' }}>{title}</h2>
                <div className="flex flex-wrap gap-2">
                  {skills?.length > 0 ? skills.map(s => <span key={s._id} className="text-sm px-3 py-1 rounded-full font-medium" style={{ background: bg, color }}>{s.name}</span>)
                    : <p className="text-sm" style={{ color: 'var(--text3)' }}>Not specified</p>}
                </div>
              </div>
            ))}

            {/* Reviews */}
            <div className="reveal ss-card p-5">
              <h2 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Reviews ({reviews?.length || 0})</h2>
              {reviews?.length === 0 ? <p className="text-sm" style={{ color: 'var(--text3)' }}>No reviews yet.</p>
                : reviews.map(r => (
                  <div key={r._id} className="pb-4 mb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>{r.reviewer?.name?.[0]}</div>
                      <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{r.reviewer?.name}</span>
                      <span style={{ color: 'var(--amber)', fontSize: '0.8rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    {r.comment && <p className="text-sm ml-11" style={{ color: 'var(--text2)' }}>{r.comment}</p>}
                  </div>
                ))
              }
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="ss-card p-6" style={{ position: 'sticky', top: '84px' }}>
              <h3 className="text-xl font-extrabold text-center mb-1" style={{ color: 'var(--purple)' }}>Free Exchange</h3>
              <p className="text-center text-sm mb-5" style={{ color: 'var(--text2)' }}>Trade your skills for this one</p>

              {success ? <div className="rounded-xl p-4 text-center text-sm font-semibold" style={{ background: '#D1FAE5', color: '#065F46' }}>✅ Swap request sent!</div>
                : user?.id !== id ? <>
                  {swapErr && <div className="text-xs rounded-xl p-3 mb-3" style={{ background: '#FEE2E2', color: '#991B1B' }}>{swapErr}</div>}
                  <textarea className="input-field resize-none mb-3 text-sm" rows={3} placeholder="Add a message (optional)..." value={msg} onChange={e => setMsg(e.target.value)} />
                  <button onClick={() => sendSwap({ providerId: id, skillOfferedId: profile.skillsOffered?.[0]?._id || profile.skillsOffered?.[0], skillWantedId: mentor.skillsOffered?.[0]?._id, message: msg })} disabled={sending}
                    className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity"
                    style={{ background: 'linear-gradient(135deg,var(--purple),var(--purple-mid))' }}>
                    📅 {sending ? 'Sending...' : 'Request Session'}
                  </button>
                </> : <p className="text-center text-sm" style={{ color: 'var(--text3)' }}>This is your profile.</p>
              }

              <hr className="my-4" style={{ borderColor: 'var(--border)' }} />
              <div className="space-y-3 text-sm">
                {[['Skill Level', mentor.skillsOffered?.[0]?.level || 'Not set'], ['Session Format', 'Online / In-person']].map(([l, v]) => (
                  <div key={l}><p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text3)' }}>{l}</p><p className="font-semibold" style={{ color: 'var(--text)' }}>{v}</p></div>
                ))}
              </div>

              {mentor.skillsWanted?.length > 0 && <>
                <hr className="my-4" style={{ borderColor: 'var(--border)' }} />
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>What {mentor.name?.split(' ')[0]} is looking for</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {mentor.skillsWanted.map(s => <span key={s._id} className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{s.name}</span>)}
                </div>
                <p className="text-xs" style={{ color: 'var(--text3)' }}>Have one of these? Perfect match!</p>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}