import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

function getStoredProfile() {
  try { return JSON.parse(localStorage.getItem('ss_profile')) || {} }
  catch { return {} }
}

function getStoredAuth() {
  try { return JSON.parse(localStorage.getItem('ss_user')) || null }
  catch { return null }
}
                                                                                    
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated } = useAuth()
  const { profile } = useUser()

  const storedAuth    = getStoredAuth()
  const storedProfile = getStoredProfile()

  const authed    = isAuthenticated || !!storedAuth
  const completed = profile.onboardingComplete || storedProfile.onboardingComplete
  const userRole  = profile.role || storedProfile.role

  if (!authed) return <Navigate to="/login" replace />
  if (!completed) return <Navigate to="/onboarding" replace />
  if (role && userRole !== role) return <Navigate to="/dashboard" replace />

  return children
}
