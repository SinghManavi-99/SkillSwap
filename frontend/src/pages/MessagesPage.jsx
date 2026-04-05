import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useChat } from '../hooks/useSwaps'
import { useProgress, useSettings, useCommunity, useScrollReveal } from '../hooks'
import { useAuth } from '../context/AuthContext'

// ── MessagesPage ──────────────────────────────────────────────────────
export function MessagesPage() {
  const { id: swapId } = useParams()
  const { user } = useAuth()
  const { messages, loading, sending, send, bottomRef, otherTyping, onTypingStart, onTypingStop } = useChat(swapId)
  const [text, setText] = useState('')
  if (!swapId) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }}><Navbar /><p className="text-center py-20" style={{ color: 'var(--text3)' }}>Select a swap to chat</p></div>
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg3)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: '720px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div className="ss-card flex-1 flex flex-col overflow-hidden" style={{ minHeight: '500px' }}>
          <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>💬</div>
            <div><p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Swap Chat</p><p className="text-xs" style={{ color: 'var(--text3)' }}>Messages saved in database</p></div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? <p className="text-center text-sm py-8" style={{ color: 'var(--text3)' }}>Loading messages...</p>
              : messages.length === 0 ? <p className="text-center text-sm py-8" style={{ color: 'var(--text3)' }}>No messages yet. Say hi! 👋</p>
              : messages.map((msg, i) => {
                  const isMe = msg.sender?._id === user?.id || msg.senderId === user?.id
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? 'var(--purple)' : 'var(--bg3)', color: isMe ? '#fff' : 'var(--text)', fontSize: '0.875rem' }}>
                        <p>{msg.text}</p>
                        <p style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7 }}>{new Date(msg.sentAt || msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  )
                })
            }
            {otherTyping && <div style={{ display: 'flex', justifyContent: 'flex-start' }}><div style={{ padding: '8px 14px', borderRadius: '18px', background: 'var(--bg3)', color: 'var(--text3)', fontSize: '0.8rem' }}>typing…</div></div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={e => { e.preventDefault(); send(text); setText('') }} style={{ display: 'flex', gap: '10px', padding: '1rem', borderTop: '1px solid var(--border)' }}>
            <input className="input-field flex-1 text-sm" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} onFocus={onTypingStart} onBlur={onTypingStop} />
            <button type="submit" disabled={sending || !text.trim()} className="btn-primary text-sm px-5 py-2.5">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── ProgressPage ──────────────────────────────────────────────────────
export function ProgressPage() {
  const { stats, loading, xpForNext } = useProgress()
  useScrollReveal()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg3)' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="text-2xl font-extrabold mb-6 reveal" style={{ color: 'var(--text)' }}>My Progress</h1>
        {loading ? <div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'var(--border)' }} />)}</div>
          : stats && <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[['Level', stats.level, 'var(--purple)'], ['XP', stats.xp, 'var(--amber)'], ['Swaps Done', stats.totalSwaps, 'var(--green)'], ['Avg Rating', stats.averageRating || '—', 'var(--blue)']].map(([l, v, c]) => (
                  <div key={l} className="ss-card reveal p-5 text-center">
                    <div className="text-3xl font-extrabold" style={{ color: c }}>{v}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="ss-card reveal p-5 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>Level {stats.level}</span>
                  <span style={{ color: 'var(--text3)' }}>{stats.xp} / {xpForNext} XP</span>
                </div>
                <div style={{ height: '12px', background: 'var(--bg3)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (stats.xp / xpForNext) * 100)}%`, background: 'linear-gradient(90deg,var(--purple),var(--purple-mid))', borderRadius: '100px', transition: 'width 0.5s ease' }} />
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text3)' }}>{xpForNext - stats.xp} XP to Level {stats.level + 1}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[['Skills I Teach', stats.skillsOffered, 'var(--purple-light)', 'var(--purple)'], ['Skills I Learn', stats.skillsWanted, 'var(--bg3)', 'var(--text2)']].map(([t, s, bg, c]) => (
                  <div key={t} className="ss-card reveal p-5">
                    <h3 className="font-bold mb-3" style={{ color: 'var(--text)' }}>{t}</h3>
                    <div className="flex flex-wrap gap-2">{(s || []).map(sk => <span key={sk._id} className="text-xs px-3 py-1 rounded-full" style={{ background: bg, color: c }}>{sk.name}</span>)}</div>
                  </div>
                ))}
              </div>
            </>
        }
      </div>
    </div>
  )
}

// ── SettingsPage ──────────────────────────────────────────────────────
export function SettingsPage() {
  const { user, profile, saveProfile, saveSkills, loading, success, error } = useSettings()
  const [name,     setName]     = useState(user?.name || '')
  const [bio,      setBio]      = useState(profile.bio || '')
  const [location, setLocation] = useState(profile.location || '')
  useScrollReveal()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg3)' }}>
      <Navbar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="text-2xl font-extrabold mb-6 reveal" style={{ color: 'var(--text)' }}>Settings</h1>
        <div className="ss-card reveal p-6 mb-4">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Profile Information</h2>
          {success && <div className="text-sm rounded-xl px-4 py-3 mb-4" style={{ background: '#D1FAE5', color: '#065F46' }}>✅ Saved successfully!</div>}
          {error   && <div className="text-sm rounded-xl px-4 py-3 mb-4" style={{ background: '#FEE2E2', color: '#991B1B' }}>{error}</div>}
          <form onSubmit={e => { e.preventDefault(); saveProfile({ name, bio, location }) }} className="space-y-4">
            <div><label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text2)' }}>Full Name</label><input className="input-field" value={name} onChange={e => setName(e.target.value)} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text2)' }}>Email</label><input className="input-field" value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text2)' }}>Bio</label><textarea className="input-field resize-none" rows={3} value={bio} onChange={e => setBio(e.target.value)} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text2)' }}>City</label><input className="input-field" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Prayagraj" /></div>
            <button type="submit" disabled={loading} className="btn-primary px-8 py-2.5">{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
        <div className="ss-card reveal p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Account</h2>
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div><p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Role</p><p className="text-xs capitalize" style={{ color: 'var(--text3)' }}>{profile.role}</p></div>
            <span className="text-xs px-3 py-1 rounded-full font-semibold capitalize" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>{profile.role}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CommunityPage ──────────────────────────────────────────────────────
export function CommunityPage() {
  const { posts, loading, hasMore, type, changeType, loadMore, createPost, toggleLike, addComment, deletePost } = useCommunity()
  const { user } = useAuth()
  const [content,  setContent]  = useState('')
  const [postType, setPostType] = useState('skill_share')
  const [posting,  setPosting]  = useState(false)
  useScrollReveal()

  const typeIcon = { skill_share: '🎯', swap_success: '🎉', question: '❓', resource: '📚', milestone: '🏆' }
  const typeLabel = { skill_share: 'Skill Share', swap_success: 'Swap Win', question: 'Question', resource: 'Resource', all: 'All Posts' }
  const TYPES = ['all','skill_share','swap_success','question','resource']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg3)' }}>
      <Navbar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="text-2xl font-extrabold mb-6 reveal" style={{ color: 'var(--text)' }}>Community</h1>

        {/* Create post */}
        <div className="ss-card reveal p-5 mb-6">
          <div className="flex gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>{user?.name?.[0]}</div>
            <textarea className="input-field flex-1 resize-none text-sm" rows={3} placeholder="Share a skill, celebrate a swap, ask a question..." value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <select className="text-xs rounded-lg px-3 py-1.5" style={{ border: '1px solid var(--border)', color: 'var(--text2)', background: 'var(--card-bg)' }} value={postType} onChange={e => setPostType(e.target.value)}>
              {['skill_share','swap_success','question','resource'].map(t => <option key={t} value={t}>{typeIcon[t]} {typeLabel[t]}</option>)}
            </select>
            <button disabled={posting || !content.trim()} onClick={async () => { setPosting(true); await createPost(content, postType); setContent(''); setPosting(false) }} className="btn-primary text-sm px-5 py-2">
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {TYPES.map(t => (
            <button key={t} onClick={() => changeType(t)} className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
              style={{ background: type === t ? 'var(--purple)' : 'var(--card-bg)', color: type === t ? '#fff' : 'var(--text3)', border: `1.5px solid ${type === t ? 'var(--purple)' : 'var(--border)'}` }}>
              {typeLabel[t] || t}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ background: 'var(--border)' }} />)}</div>
          : posts.length === 0 ? <div className="ss-card reveal p-12 text-center"><p className="text-3xl mb-3">📣</p><p style={{ color: 'var(--text3)' }}>No posts yet. Be the first!</p></div>
          : <div className="space-y-4">
              {posts.map(post => (
                <div key={post._id} className="ss-card reveal p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>{post.author?.name?.[0]}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{post.author?.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text3)' }}>{new Date(post.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className="text-xl">{typeIcon[post.type] || '📝'}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text2)' }}>{post.content}</p>
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text3)' }}>
                    <button onClick={() => toggleLike(post._id)} className="flex items-center gap-1 transition-colors hover:text-red-500">❤️ {post.likeCount || 0}</button>
                    <span>💬 {post.comments?.length || 0}</span>
                    <span>👁 {post.viewCount || 0}</span>
                    {post.author?._id === user?.id && <button onClick={() => deletePost(post._id)} className="ml-auto transition-colors hover:text-red-500">🗑</button>}
                  </div>
                </div>
              ))}
              {hasMore && <button onClick={loadMore} className="btn-outline w-full py-3 text-sm">Load more</button>}
            </div>
        }
      </div>
    </div>
  )
}

export default MessagesPage