import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSkills, useScrollReveal } from '../hooks'

const CATS = ['All','Technology','Design','Music','Language','Cooking','Fitness','Business','Academic','Other']

const catColors = {
  Technology: ['#DBEAFE','#3B82F6'],
  Design: ['#FCE7F3','#EC4899'],
  Music: ['#EDE9FE','#7C3AED'],
  Language: ['#D1FAE5','#10B981'],
  Cooking: ['#FEF3C7','#F59E0B'],
  Fitness: ['#FEE2E2','#EF4444'],
  Academic: ['#E0E7FF','#6366F1'],
  Business: ['#D1FAE5','#059669'],
  Other: ['#F3F4F6','#6B7280']
}

const catEmoji = {
  Technology: '💻',
  Design: '🎨',
  Music: '🎸',
  Language: '🗣️',
  Cooking: '🍳',
  Fitness: '💪',
  Business: '📊',
  Academic: '📐',
  Other: '📚'
}

export default function ExplorePage() {
  const [cat, setCat] = useState('All')

  const {
    skills,
    loading,
    hasMore,
    applyFilter,
    loadMore
  } = useSkills()

  useScrollReveal()

  const handleCat = (c) => {
    setCat(c)
    applyFilter(c === 'All' ? {} : { category: c })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ padding: '3rem 2rem' }}>
        <h1 className="text-3xl font-bold">Explore Skills</h1>

        <form
          onSubmit={e => {
            e.preventDefault()
            applyFilter({ search: e.target.search.value })
          }}
          className="flex gap-2 mt-4"
        >
          <input name="search" className="border p-2 flex-1" placeholder="Search..." />
          <button className="bg-purple-500 text-white px-4">Search</button>
        </form>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap px-6">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => handleCat(c)}
            className={`px-3 py-1 rounded ${
              cat === c ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {loading && skills.length === 0 ? (
          <p>Loading...</p>
        ) : skills.length === 0 ? (
          <p>No skills found</p>
        ) : (
          skills.map(s => {
            const [bg, color] = catColors[s.category] || ['#eee','#333']

            return (
              <Link
                key={s._id}
                to={`/mentor/${s.createdBy?._id}`}
                className="border p-4 rounded"
              >
                <div
                  style={{
                    height: '100px',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {catEmoji[s.category]}
                </div>

                <h3 className="font-bold mt-2">{s.name}</h3>
                <p className="text-sm">{s.description}</p>
                <p className="text-xs mt-1">{s.createdBy?.name}</p>
              </Link>
            )
          })
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mb-6">
          <button onClick={loadMore} className="bg-gray-200 px-4 py-2">
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}