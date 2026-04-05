import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSkills, useScrollReveal } from '../hooks'

import { useSkills } from '../hooks'

const { skills, categories, loading, applyFilter, loadMore } = useSkills()
// → GET /api/skills → MongoDB Skill collection

const CATS = ['All','Technology','Design','Music','Language','Cooking','Fitness','Business','Academic','Other']
const catColors = { Technology: ['#DBEAFE','#3B82F6'], Design: ['#FCE7F3','#EC4899'], Music: ['#EDE9FE','#7C3AED'], Language: ['#D1FAE5','#10B981'], Cooking: ['#FEF3C7','#F59E0B'], Fitness: ['#FEE2E2','#EF4444'], Academic: ['#E0E7FF','#6366F1'], Business: ['#D1FAE5','#059669'], Other: ['#F3F4F6','#6B7280'] }
const catEmoji = { Technology: '💻', Design: '🎨', Music: '🎸', Language: '🗣️', Cooking: '🍳', Fitness: '💪', Business: '📊', Academic: '📐', Other: '📚' }

export default function ExplorePage() {
  const [cat, setCat] = useState('All')
  const { skills, categories, loading, hasMore, applyFilter, loadMore } = useSkills()
  useScrollReveal()

  const handleCat = (c) => { setCat(c); applyFilter(c === 'All' ? {} : { category: c }) }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ background: 'linear-gradient(135deg,var(--bg2),var(--bg3))', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <h1 className="text-3xl font-extrabold mb-2 reveal" style={{ color: 'var(--text)' }}>Explore Skills</h1>
          <p className="reveal mb-5" style={{ color: 'var(--text3)', transitionDelay: '0.1s' }}>Find the perfect skill to learn or someone to teach</p>
          <form onSubmit={e => { e.preventDefault(); applyFilter({ search: e.target.search.value }) }} className="flex gap-3 max-w-lg reveal" style={{ transitionDelay: '0.15s' }}>
            <input name="search" className="input-field flex-1" placeholder="Search skills..." style={{ background: 'var(--card-bg)' }} />
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '2rem' }}>
        <div className="flex gap-2 flex-wrap mb-6">
          {CATS.map(c => (
            <button key={c} onClick={() => handleCat(c)} className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: cat === c ? 'var(--purple)' : 'var(--card-bg)', color: cat === c ? '#fff' : 'var(--text2)', border: `1.5px solid ${cat === c ? 'var(--purple)' : 'var(--border)'}` }}>
              {c}
            </button>
          ))}
        </div>

        {loading && skills.length === 0
          ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">{[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: 'var(--border)' }} />)}</div>
          : skills.length === 0
            ? <div className="text-center py-20"><p className="text-5xl mb-4">🔍</p><p style={{ color: 'var(--text3)' }}>No skills found. Try another category.</p></div>
            : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {skills.map(s => {
                  const [bg, color] = catColors[s.category] || ['#F3F4F6','#6B7280']
                  return (
                    <Link key={s._id} to={`/mentor/${s.createdBy?._id}`} className="ss-card ss-card-hover reveal overflow-hidden block">
                      <div className="h-36 flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg,${bg},${bg}aa)` }}>
                        {catEmoji[s.category] || '📚'}
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{s.category}</div>
                        <div className="font-bold mb-1" style={{ color: 'var(--text)' }}>{s.name}</div>
                        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text3)' }}>{s.description || 'Learn through peer exchange'}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${bg}`, color }}>{s.createdBy?.name?.[0] || 'U'}</div>
                            <span className="text-xs font-medium" style={{ color: 'var(--text2)' }}>{s.createdBy?.name || 'User'}</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>{s.level}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
        }
        {hasMore && <div className="text-center mt-8"><button onClick={loadMore} disabled={loading} className="btn-outline px-8 py-3">{loading ? 'Loading...' : 'Load more'}</button></div>}
      </div>
    </div>
  )
}