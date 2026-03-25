import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated } = useAuth()
  const { profile } = useUser()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (!profile.onboardingComplete) return <Navigate to="/onboarding" replace />

  if (role && profile.role !== role) return <Navigate to="/dashboard" replace />

  return children
}
