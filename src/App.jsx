import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'

import SplashPage        from './pages/SplashPage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import OnboardingPage    from './pages/OnboardingPage'
import RoleDashboard     from './pages/RoleDashboard'
import SeekerDashboard   from './pages/SeekerDashboard'
import SageDashboard     from './pages/SageDashboard'
import CatalystDashboard from './pages/CatalystDashboard'
import MentorProfilePage from './pages/MentorProfilePage'
import ExplorePage       from './pages/ExplorePage'
import MySwapsPage       from './pages/MySwapsPage'
import ProgressPage      from './pages/ProgressPage'
import MessagesPage      from './pages/MessagesPage'
import SkillPathPage     from './pages/SkillPathPage'
import SettingsPage      from './pages/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/"           element={<SplashPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Role-based dashboard redirect */}
            <Route path="/dashboard" element={
              <ProtectedRoute><RoleDashboard /></ProtectedRoute>
            } />

            {/* Seeker pages */}
            <Route path="/seeker" element={
              <ProtectedRoute role="seeker"><SeekerDashboard /></ProtectedRoute>
            } />

            {/* Sage pages */}
            <Route path="/sage" element={
              <ProtectedRoute role="sage"><SageDashboard /></ProtectedRoute>
            } />

            {/* Catalyst pages */}
            <Route path="/catalyst" element={
              <ProtectedRoute role="catalyst"><CatalystDashboard /></ProtectedRoute>
            } />

            {/* Shared protected pages */}
            <Route path="/mentor/:id" element={
              <ProtectedRoute><MentorProfilePage /></ProtectedRoute>
            } />
            <Route path="/explore" element={
              <ProtectedRoute><ExplorePage /></ProtectedRoute>
            } />
            <Route path="/swaps" element={
              <ProtectedRoute><MySwapsPage /></ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute><ProgressPage /></ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute><MessagesPage /></ProtectedRoute>
            } />
            <Route path="/path/:id" element={
              <ProtectedRoute><SkillPathPage /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><SettingsPage /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  )
}
