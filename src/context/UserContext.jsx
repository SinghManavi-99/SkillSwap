import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

const defaultProfile = {
  role: 'seeker',          // 'seeker' | 'sage' | 'catalyst'
  skillsOffered: [],
  skillsWanted: [],
  bio: '',
  location: '',
  onboardingComplete: false,
  xp: 0,
  level: 1,
  streak: 0,
  swapsDone: 0,
}

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try { return { ...defaultProfile, ...JSON.parse(localStorage.getItem('ss_profile')) } }
    catch { return defaultProfile }
  })

  useEffect(() => {
    localStorage.setItem('ss_profile', JSON.stringify(profile))
  }, [profile])

  function updateProfile(fields) {
    setProfile(prev => ({ ...prev, ...fields }))
  }

  function resetProfile() {
    setProfile(defaultProfile)
    localStorage.removeItem('ss_profile')
  }

  return (
    <UserContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside UserProvider')
  return ctx
}
