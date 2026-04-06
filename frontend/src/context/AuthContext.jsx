import { createContext, useContext, useState, useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../api/socket'
import { getAuthData, saveAuthData, clearAuthData } from '../utils/auth.utils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getAuthData())

  useEffect(() => {
    if (auth) {
      // ✅ save to localStorage
      saveAuthData(auth)

      // ✅ connect socket
      if (auth.accessToken) {
        connectSocket(auth.accessToken)
      }
    } else {
      clearAuthData()
      disconnectSocket()
    }
  }, [auth])

  // 🔐 LOGIN
  const login = (data) => {
    setAuth(data)
  }

  // 🚪 LOGOUT
  const logout = () => {
    setAuth(null)
  }

  // ✏️ UPDATE USER
  const updateUser = (fields) => {
    setAuth(prev => ({
      ...prev,
      user: { ...prev.user, ...fields }
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user || null,
        token: auth?.accessToken || null,
        login,
        logout,
        updateUser,
        isAuthenticated: !!auth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}