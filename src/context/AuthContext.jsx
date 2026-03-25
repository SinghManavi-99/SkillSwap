import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_user')) || null }
    catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem('ss_user', JSON.stringify(user))
    else localStorage.removeItem('ss_user')
  }, [user])

  function login(userData) {
    setUser(userData)
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('ss_user')
    localStorage.removeItem('ss_profile')
  }

  function updateUser(fields) {
    setUser(prev => ({ ...prev, ...fields }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
