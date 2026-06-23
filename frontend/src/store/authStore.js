import { create } from 'zustand'
import apiClient from '../api/client'
import { decodeJwt, isTokenExpired } from '../utils/auth'

const TOKEN_KEY = 'stages_pfe_token'
const USER_KEY = 'stages_pfe_user'

function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY)
  const user = localStorage.getItem(USER_KEY)
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    return { token: null, user: null }
  }
  return { token, user: user ? JSON.parse(user) : null }
}

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),
  loading: false,
  error: null,
  isAuthenticated: () => {
    const token = useAuthStore.getState().token
    return Boolean(token && !isTokenExpired(token))
  },
  login: async ({ email, password }) => {
    set({ loading: true, error: null })
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      const { data } = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      const payload = decodeJwt(data.access_token)
      const user = { id: payload?.sub, email, role: payload?.role }
      localStorage.setItem(TOKEN_KEY, data.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      set({ token: data.access_token, user, loading: false })
      return user
    } catch (error) {
      set({ loading: false, error: error.response?.data?.detail || 'Connexion impossible' })
      throw error
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null })
    try {
      await apiClient.post('/auth/register', payload)
      set({ loading: false })
    } catch (error) {
      set({ loading: false, error: error.response?.data?.detail || 'Inscription impossible' })
      throw error
    }
  },
  setRole: (role) => {
    const current = useAuthStore.getState().user || {}
    const user = { ...current, role }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user })
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ token: null, user: null, error: null })
  },
}))
