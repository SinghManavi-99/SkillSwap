import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function RoleDashboard() {
  const { profile, loading } = useUser()

  // ⏳ wait until profile loads
  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  // ❌ no profile → onboarding
  if (!profile) {
    return <Navigate to="/onboarding" replace />
  }

  // ❌ no role → onboarding
  if (!profile.role) {
    return <Navigate to="/onboarding" replace />
  }

  // ✅ always go to main dashboard
  return <Navigate to="/dashboard/home" replace />
}