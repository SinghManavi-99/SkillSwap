import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MatchesPage() {
const [matches, setMatches] = useState([])
const [loading, setLoading] = useState(true)

const token = localStorage.getItem('token')

useEffect(() => {
fetchMatches()
}, [])

const fetchMatches = async () => {
try {
const res = await axios.get('http://localhost:5000/api/users/matches', {
headers: {
Authorization: `Bearer ${token}`
}
})
setMatches(res.data.data)
} catch (err) {
console.error(err)
} finally {
setLoading(false)
}
}

const handleSwap = async (user) => {
try {
await axios.post(
'http://localhost:5000/api/swaps',
{
providerId: user.user._id,
skillOfferedId: user.matchedSkills.theyWant[0]?._id,
skillWantedId: user.matchedSkills.theyOffer[0]?._id,
message: "Let's swap skills 🚀"
},
{
headers: {
Authorization: `Bearer ${token}`
}
}
)
alert('Swap request sent!')
} catch (err) {
console.error(err)
alert('Error sending swap')
}
}

if (loading) return <h2 className="p-4">Loading matches...</h2>

return ( <div className="p-6"> <h1 className="text-2xl font-bold mb-4">🔥 Matches</h1>

```
  {matches.length === 0 ? (
    <p>No matches found</p>
  ) : (
    <div className="grid gap-4">
      {matches.map((m, index) => (
        <div key={index} className="border p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">{m.user.name}</h2>

          <p className="text-sm text-gray-600">
            Match Type: <b>{m.matchType}</b>
          </p>

          <div className="mt-2">
            <p><b>They Offer:</b> {m.matchedSkills.theyOffer.map(s => s.name).join(', ')}</p>
            <p><b>They Want:</b> {m.matchedSkills.theyWant.map(s => s.name).join(', ')}</p>
          </div>

          <button
            onClick={() => handleSwap(m)}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
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
