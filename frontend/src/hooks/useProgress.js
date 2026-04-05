import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { authApi, swapsApi, reviewsApi } from '../api'

export function useProgress() {
  const { user }    = useAuth()
  const { profile } = useUser()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!user?.id) return

    // Fetch all data in parallel from MongoDB
    Promise.all([
      authApi.getMe(),
      swapsApi.getAll({ status: 'completed' }),
      reviewsApi.getForUser(user.id),
    ])
      .then(([meRes, swapsRes, reviewsRes]) => {
        const me      = meRes.data
        const swaps   = swapsRes.data
        const reviews = reviewsRes.data

        setStats({
          name:            me.name,
          avatar:          me.avatar,
          reputationScore: me.reputationScore,
          totalSwaps:      me.totalSwapsCompleted,
          averageRating:   reviews.average,
          skillsOffered:   me.skillsOffered || [],
          skillsWanted:    me.skillsWanted  || [],
          completedSwaps:  swaps,
          reviews:         reviews.reviews || [],
          // XP + level stored locally (not in backend yet)
          xp:     profile.xp    || 0,
          level:  profile.level || 1,
          streak: profile.streak || 0,
        })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user?.id])

  const xpForNext = (stats?.level || 1) * 200

  return { stats, loading, error, xpForNext }
}