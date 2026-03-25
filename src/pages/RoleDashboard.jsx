import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function RoleDashboard() {
  const { profile, updateProfile } = useUser()
  const dest = { seeker: '/seeker', sage: '/sage', catalyst: '/catalyst' }

  if (!profile.role) {
    updateProfile({ role: 'seeker' })
    return <Navigate to='/seeker' replace />
  }

  return <Navigate to={dest[profile.role] || '/seeker'} replace />
}
