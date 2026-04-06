import { useState, useEffect } from 'react'
import { getMyProfile, updateUserProfile } from '../api/user.api'

// ── useUserProfile ─────────────────────────────────────
export function useUserProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 📥 fetch profile
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await getMyProfile()
      const data = res.data?.data || res.data

      setProfile(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  // ✏️ update profile
  const updateProfile = async (fields) => {
    try {
      setLoading(true)
      setError(null)

      const res = await updateUserProfile(fields)
      const data = res.data?.data || res.data

      setProfile(data)

      return data
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile
  }
}