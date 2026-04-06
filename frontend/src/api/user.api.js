import api from './client'

// 👤 Get current logged-in user
export const getCurrentUser = async () => {
  const res = await api.get('/users/me')
  return res.data.data
}

// 🧠 Update skills (Onboarding / SkillsPage)
export const updateSkills = async (data) => {
  const res = await api.put('/users/skills', data)
  return res.data.data
}

// 🔍 Get matches (MatchesPage)
export const getMatches = async () => {
  const res = await api.get('/users/matches')
  return res.data.data
}

// 👤 Get user by ID (MentorProfilePage)
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`)
  return res.data.data
}

// ✏️ Update user profile (future use)
export const updateProfile = async (data) => {
  const res = await api.put('/users/profile', data)
  return res.data.data
}