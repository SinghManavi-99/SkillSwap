import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { MESSAGES } from '../data/Mockdata'

export default function MessagesPage() {
  const { user } = useAuth()
  const [activeId, setActiveId] = useState(MESSAGES[0].id)
  const [input, setInput] = useState('')
  const [threads, setThreads] = useState(MESSAGES)

  const active = threads.find(c => c.id === activeId)

  function sendMessage() {
    if (!input.trim()) return
    setThreads(prev => prev.map(c => c.id !== activeId ? c : {
      ...c,
      lastMsg: input,
      time: 'Now',
      unread: 0,
      thread: [...c.thread, { from:'me', text:input, time:'Now' }],
    }))
    setInput('')
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--surf)' }}>
      <Navbar />
      <div style={{ display:'flex', flex:1, height:'calc(100vh - 56px)' }}>

        {/* Conversation list */}
        <div style={{ width:'280px', flexShrink:0, background:'#fff', borderRight:'0.5px solid var(--lav-100)', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'16px', borderBottom:'0.5px solid var(--lav-100)' }}>
            <div style={{ fontSize:'14px', fontWeight:500, marginBottom:'10px' }}>Messages</div>
            <input className="input-base" placeholder="Search..." style={{ fontSize:'12px' }} />
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {threads.map(c => (
              <div key={c.id} onClick={() => setActiveId(c.id)} style={{
                display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', cursor:'pointer',
                background: activeId === c.id ? 'var(--lav-50)' : 'transparent',
                borderBottom:'0.5px solid var(--lav-100)',
                transition:'background .12s',
              }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{
                    width:'40px', height:'40px', borderRadius:'50%',
                    background:`var(--${c.color}-50)`, color:`var(--${c.color}-600)`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:500,
                  }}>{c.mentorInitials}</div>
                  {c.unread > 0 && (
                    <div style={{
                      position:'absolute', top:0, right:0, width:'16px', height:'16px', borderRadius:'50%',
                      background:'var(--lav-600)', color:'#fff', fontSize:'9px', fontWeight:500,
                      display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff',
                    }}>{c.unread}</div>
                  )}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'2px' }}>
                    <span style={{ fontSize:'13px', fontWeight:500 }}>{c.mentorName}</span>
                    <span style={{ fontSize:'10px', color:'#aaa' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize:'11px', color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.lastMsg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thread */}
        {active ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
            {/* Header */}
            <div style={{ padding:'12px 20px', background:'#fff', borderBottom:'0.5px solid var(--lav-100)', display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'50%', flexShrink:0,
                background:`var(--${active.color}-50)`, color:`var(--${active.color}-600)`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:500,
              }}>{active.mentorInitials}</div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:500 }}>{active.mentorName}</div>
                <div style={{ fontSize:'11px', color:'#888' }}>Skill swap partner</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, padding:'20px', display:'flex', flexDirection:'column', gap:'10px', overflowY:'auto' }}>
              {active.thread.map((msg, i) => (
                <div key={i} style={{
                  display:'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth:'65%', padding:'8px 12px', borderRadius: msg.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.from === 'me' ? 'var(--lav-600)' : '#fff',
                    color: msg.from === 'me' ? '#fff' : '#111',
                    fontSize:'13px', lineHeight:1.5,
                    border: msg.from === 'me' ? 'none' : '0.5px solid var(--lav-100)',
                  }}>
                    {msg.text}
                    <div style={{ fontSize:'10px', opacity:0.6, marginTop:'3px', textAlign:'right' }}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding:'12px 20px', background:'#fff', borderTop:'0.5px solid var(--lav-100)', display:'flex', gap:'8px' }}>
              <input
                className="input-base"
                style={{ flex:1 }}
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button className="btn-primary" style={{ padding:'8px 16px', borderRadius:'12px', fontSize:'13px' }}
                onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'14px' }}>
            Select a conversation
          </div>
        )}
      </div>
    </div>
  )
}
