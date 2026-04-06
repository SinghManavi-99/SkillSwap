import api from './client'

// 🔄 Get all swaps (MySwapsPage)
export const getSwaps = async () => {
  const res = await api.get('/swaps')
  return res.data.data
}

// 🔍 Get single swap (SwapDetailPage)
export const getSwapById = async (id) => {
  const res = await api.get(`/swaps/${id}`)
  return res.data.data
}

// ➕ Create new swap (MatchesPage)
export const createSwap = async (data) => {
  const res = await api.post('/swaps', data)
  return res.data.data
}

// 🔁 Update swap status (accept / reject / complete / cancel)
export const updateSwapStatus = async (id, status) => {
  const res = await api.patch(`/swaps/${id}/status`, { status })
  return res.data.data
}

// 💬 Get all messages of a swap (Chat page)
export const getMessages = async (swapId) => {
  const res = await api.get(`/swaps/${swapId}/messages`)
  return res.data.data
}

// 📩 Send message in chat
export const sendMessage = async (swapId, text) => {
  const res = await api.post(`/swaps/${swapId}/messages`, { text })
  return res.data.data
}