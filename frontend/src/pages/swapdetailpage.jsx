import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSwapById, updateSwapStatus } from '../api/swap.api'
import { useAuth } from '../context/AuthContext'

export default function SwapDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const [swap, setSwap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSwap()
  }, [id])

  const fetchSwap = async () => {
    try {
      const data = await getSwapById(id)
      setSwap(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (status) => {
    try {
      await updateSwapStatus(id, status)
      fetchSwap() // refresh
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-6">Loading swap...</div>
  if (!swap) return <div className="p-6">Swap not found</div>

  const isRequester = swap.requester?._id === user?._id
  const other = isRequester ? swap.provider : swap.requester

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">🔄 Swap Details</h1>

      <div className="border p-5 rounded-lg shadow">

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center font-bold">
            {other?.name?.[0] || '?'}
          </div>
          <div>
            <p className="font-semibold text-lg">{other?.name}</p>
            <p className="text-sm text-gray-500">
              Status: <b>{swap.status}</b>
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-3 space-y-1">
          <p>
            <b>You Offer:</b> {swap.skillOffered?.name}
          </p>
          <p>
            <b>You Get:</b> {swap.skillWanted?.name}
          </p>
        </div>

        {/* Message */}
        {swap.message && (
          <p className="mt-3 italic text-gray-600">
            "{swap.message}"
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3 flex-wrap">

          {/* Accept / Reject */}
          {!isRequester && swap.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatus('accepted')}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                ✅ Accept
              </button>

              <button
                onClick={() => handleStatus('rejected')}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </>
          )}

          {/* Cancel */}
          {isRequester && ['pending', 'accepted'].includes(swap.status) && (
            <button
              onClick={() => handleStatus('cancelled')}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}

          {/* Complete */}
          {['accepted', 'in_progress'].includes(swap.status) && (
            <button
              onClick={() => handleStatus('completed')}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Mark Complete
            </button>
          )}

          {/* Chat */}
          {swap.status !== 'pending' && (
            <Link
              to={`/messages/${swap._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              💬 Chat
            </Link>
          )}

          {/* Back */}
          <Link
            to="/swaps"
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Back
          </Link>

        </div>
      </div>
    </div>
  )
}