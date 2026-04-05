import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { usersApi, skillsApi } from '../api'

export function useOnboarding() {
  const { updateProfile } = useUser()
  const { updateUser }    = useAuth()
  const navigate          = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // Called at end of onboarding — saves everything to MongoDB
  async function completeOnboarding({ name, bio, location, role, skillsOffered = [], skillsWanted = [] }) {
    setLoading(true); setError(null)
    try {
      // 1. Update profile in MongoDB
      await usersApi.updateProfile({
        name,
        bio,
        location: { city: location },
      })

      // 2. Create skills in MongoDB and get their IDs
      const createSkills = async (skills) => {
        return Promise.all(
          skills
            .filter(s => s.name?.trim())
            .map(async (s) => {
              if (s._id) return s._id          // already in DB
              const res = await skillsApi.create(s)
              return res.data._id
            })
        )
      }

      const offeredIds = await createSkills(skillsOffered)
      const wantedIds  = await createSkills(skillsWanted)

      // 3. Link skills to user in MongoDB
      await usersApi.updateSkills(offeredIds, wantedIds)

      // 4. Update AuthContext
      updateUser({ name })

      // 5. Update UserContext (localStorage)
      updateProfile({
        role,
        bio,
        location,
        skillsOffered: offeredIds,
        skillsWanted:  wantedIds,
        onboardingComplete: true,
      })

      // 6. Go to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { completeOnboarding, loading, error }
}