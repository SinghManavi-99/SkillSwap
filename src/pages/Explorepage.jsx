import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import MentorCard from '../components/MentorCard'
import { useUser } from '../context/UserContext'
import { MENTORS, SKILLS } from '../data/Mockdata'
import { sortMentorsByMatch, getMatchedSkills } from '../utils/MatchScore'

export default function ExplorePage() {
  const { profile } = useUser()
  const [search, setSearch] = useState('')
  const [filterSkill, setFilterSkill] = useState('')
  const [sortBy, setSortBy] = useState('match')

  const filtered = useMemo(() => {
    let list = sortMentorsByMatch(MENTORS, profile.skillsWanted, profile.skillsOffered)

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.skillsOffered.some(s => s.toLowerCase().includes(q))
      )
    }

    if (filterSkill) {
      list = list.filter(m => m.skillsOffered.some(s => s.toLowerCase() === filterSkill.toLowerCase()))
    }

    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sortBy === 'swaps')  list = [...list].sort((a, b) => b.swapsDone - a.swapsDone)

    return list
  }, [search, filterSkill, sortBy, profile])

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--surf)' }}>
      <Navbar />
      <div style={{ padding:'20px 24px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom:'20px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:500, marginBottom:'4px' }}>Explore mentors</h1>
          <p style={{ fontSize:'13px', color:'#888' }}>Find your perfect skill swap partner from {MENTORS.length} mentors.</p>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap' }}>
          <input
            className="input-base"
            style={{ flex:'1', minWidth:'200px', maxWidth:'320px' }}
            placeholder="Search by name or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="input-base" style={{ width:'180px' }}
            value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
            <option value="">All skills</option>
            {SKILLS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="input-base" style={{ width:'160px' }}
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="match">Sort: Best match</option>
            <option value="rating">Sort: Top rated</option>
            <option value="swaps">Sort: Most swaps</option>
          </select>
        </div>

        {/* Results */}
        <p style={{ fontSize:'12px', color:'#888', marginBottom:'14px' }}>{filtered.length} mentor{filtered.length !== 1 ? 's' : ''} found</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'14px' }}>
          {filtered.map(mentor => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              matchScore={mentor.matchScore}
              matchedSkills={getMatchedSkills(profile.skillsWanted, mentor.skillsOffered)}
            />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px', color:'#aaa', fontSize:'14px' }}>
              No mentors found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
