import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import SplashPage from './pages/SplashPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Core App Pages
import OnboardingPage from './pages/OnboardingPage'
import RoleDashboard from './pages/roleDashboard'
import ExplorePage from './pages/ExplorePage'
import MentorProfilePage from './pages/MentorProfilePage'

// 🔥 NEW IMPORTANT PAGES
import MatchesPage from './pages/MatchesPage'
import SkillsPage from './pages/SkillsPage'
import SwapDetailPage from './pages/SwapDetailPage'

// Existing Pages
import MySwapsPage from './pages/MySwapsPage'
import MessagesPage from './pages/MessagesPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import CommunityPage from './pages/CommunityPage'

export default function App() {
return ( <AuthProvider> <UserProvider> <BrowserRouter> <Routes>

```
        {/* Public Routes */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />

        {/* 🔥 Core Feature Routes */}
        <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillsPage /></ProtectedRoute>} />
        <Route path="/swaps" element={<ProtectedRoute><MySwapsPage /></ProtectedRoute>} />
        <Route path="/swaps/:id" element={<ProtectedRoute><SwapDetailPage /></ProtectedRoute>} />

        {/* Other Features */}
        <Route path="/mentor/:id" element={<ProtectedRoute><MentorProfilePage /></ProtectedRoute>} />
        <Route path="/messages/:id?" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  </UserProvider>
</AuthProvider>
)
}
