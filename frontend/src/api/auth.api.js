import api from './client'
import { saveAuthData, clearAuthData } from '../utils/auth.utils'

// 🔐 LOGIN
export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data)

  const { user, accessToken, refreshToken } = res.data.data

  // ✅ Save in localStorage (single source of truth)
  saveAuthData({ user, accessToken, refreshToken })

  return user
}

// 📝 REGISTER
export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data)

  const { user, accessToken, refreshToken } = res.data.data

  // ✅ Auto login after register
  saveAuthData({ user, accessToken, refreshToken })

  return user
}

// 🔄 REFRESH TOKEN (rare manual use, mostly interceptor handles it)
export const refreshAuth = async () => {
  const res = await api.post('/auth/refresh-token')

  const { user, accessToken, refreshToken } = res.data.data

  saveAuthData({ user, accessToken, refreshToken })

  return accessToken
}

// 🚪 LOGOUT
export const logoutUser = async () => {
  try {
    await api.post('/auth/logout')
  } catch (err) {
    console.warn('Logout API failed, clearing locally anyway')
  } finally {
    // ✅ Always clear local auth
    clearAuthData()
  }
}