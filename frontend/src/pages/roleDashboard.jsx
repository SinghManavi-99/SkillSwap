import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
export default function RoleDashboard() {
  const { profile } = useUser()
  return <Navigate to={{ seeker: '/seeker', sage: '/sage', catalyst: '/catalyst' }[profile.role] || '/seeker'} replace />
}