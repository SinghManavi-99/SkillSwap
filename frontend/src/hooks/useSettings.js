import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }    from '../context/AuthContext'
import { useUser }    from '../context/UserContext'
import { usersApi }   from '../api'
import { useAuthActions } from './useAuth'

export function useSettings() {
  const { user, updateUser }              = useAuth()
  const { profile, updateProfile, resetProfile } = useUser()
  const { handleLogout }                  = useAuthActions()
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)
  const [error,   setError]               = useState(null)

  // Save profile → PUT /api/users/profile → MongoDB
  async function saveProfile({ name, bio, location }) {
    setLoading(true); setError(null); setSuccess(false)
    try {
      await usersApi.updateProfile({ name, bio, location: { city: location } })
      updateUser({ name })
      updateProfile({ bio, location })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Save skills → PUT /api/users/skills → MongoDB
  async function saveSkills(skillsOffered, skillsWanted) {
    setLoading(true); setError(null)
    try {
      await usersApi.updateSkills(skillsOffered, skillsWanted)
      updateProfile({ skillsOffered, skillsWanted })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Deactivate account → DELETE /api/users/me → MongoDB
  async function deleteAccount() {
    setLoading(true)
    try {
      await usersApi.deactivate()
      handleLogout()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    user, profile,
    saveProfile, saveSkills, deleteAccount,
    loading, success, error,
  }
}