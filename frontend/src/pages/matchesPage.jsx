import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMatches } from '../api/user.api'
import { createSwap } from '../api/swap.api'

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const data = await getMatches()
      setMatches(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = async (m) => {
    try {
      const swap = await createSwap({
        providerId: m.user._id,
        skillOfferedId: m.matchedSkills.theyWant[0]?._id,
        skillWantedId: m.matchedSkills.theyOffer[0]?._id,
        message: "Let's swap skills 🚀"
      })

      // 🔥 IMPORTANT: redirect to detail page
      navigate(`/swaps/${swap._id}`)

    } catch (err) {
      console.error(err)
      alert('Error sending swap')
    }
  }

  if (loading) return <h2 className="p-4">Loading matches...</h2>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔥 Matches</h1>

      {matches.length === 0 ? (
        <p>No matches found</p>
      ) : (
        <div className="grid gap-4">
          {matches.map((m) => (
            <div key={m.user._id} className="border p-4 rounded-lg shadow">

              <h2 className="text-lg font-semibold">{m.user.name}</h2>

              <p className="text-sm text-gray-600">
                Match Type: <b>{m.matchType}</b>
              </p>

              <div className="mt-2">
                <p>
                  <b>They Offer:</b>{' '}
                  {m.matchedSkills.theyOffer.map(s => s.name).join(', ')}
                </p>

                <p>
                  <b>They Want:</b>{' '}
                  {m.matchedSkills.theyWant.map(s => s.name).join(', ')}
                </p>
              </div>

              <button
                onClick={() => handleSwap(m)}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Request Swap
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}