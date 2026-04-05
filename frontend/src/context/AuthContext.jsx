import { createContext, useContext, useState, useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../api/socket'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_user')) || null } catch { return null }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('ss_user', JSON.stringify(user))
      if (user.token) connectSocket(user.token)
    } else {
      localStorage.removeItem('ss_user')
      disconnectSocket()
    }
  }, [user])

  const login      = (u)      => setUser(u)
  const logout     = ()       => setUser(null)
  const updateUser = (fields) => setUser(p => ({ ...p, ...fields }))

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}