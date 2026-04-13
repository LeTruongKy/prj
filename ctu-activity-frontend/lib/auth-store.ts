import { create } from 'zustand'
import { apiClient } from './api'

export interface User {
  user_id: string
  email: string
  fullName: string
  studentCode: string
  unitId?: number
  unitName?: string
  role: string
  avatarUrl?: string
  major?: string
  status?: string
  createdAt?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean
  error: string | null
  accessToken: string | null
  refreshToken: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, studentCode: string, email: string, password: string, unitId?: number) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  fetchMe: () => Promise<void>
  refreshAccessToken: () => Promise<string>
  setUser: (user: User | null) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,
  accessToken: null,
  refreshToken: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      // Extract token and user from response.data.data
      const { accessToken, refreshToken, user } = response.data.data || response.data
      
      if (!accessToken) {
        throw new Error('No access token in response')
      }
      
      // Save tokens to localStorage FIRST
      localStorage.setItem('auth_token', accessToken)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }
      
      // Update apiClient Authorization header IMMEDIATELY
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(user))
      
      // Update store state
      set({
        user,
        accessToken,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      
      // Fetch latest user data with small delay to ensure token is committed
      const storeState = useAuthStore.getState()
      await new Promise((resolve) => setTimeout(resolve, 100))
      try {
        await storeState.fetchUser()
      } catch (fetchError) {
        // Don't throw - user is already logged in with token and initial data
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      })
      throw error
    }
  },

  register: async (fullName: string, studentCode: string, email: string, password: string, unitId?: number) => {
    set({ isLoading: true, error: null })
    try {
      const payload: any = {
        fullName,
        studentCode,
        email,
        password,
      }
      
      // Add unitId if provided
      if (unitId) {
        payload.unitId = unitId
      }
      
      const response = await apiClient.post('/auth/register', payload)

      set({
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      set({
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await apiClient.post('/auth/logout', {})
    } catch (error) {
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      // Clear Authorization header
      delete apiClient.defaults.headers.common['Authorization']
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isHydrated: false,
        error: null,
        accessToken: null,
        refreshToken: null,
      })
    }
  },

  refreshAccessToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiClient.post('/auth/refresh-token', {}, {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
        },
      })

      const { accessToken } = response.data.data || response.data

      if (!accessToken) {
        throw new Error('No access token in refresh response')
      }

      // Save new token
      localStorage.setItem('auth_token', accessToken)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      // Update store
      set({
        accessToken,
        error: null,
      })

      return accessToken
    } catch (error) {
      // Refresh failed - logout user
      const storeState = useAuthStore.getState()
      await storeState.logout()
      throw error
    }
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get('/users/me/profile')
      
      // Extract user from response.data.data or response.data.user
      const user = response.data.data || response.data.user || response.data

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      })
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      delete apiClient.defaults.headers.common['Authorization']
    }
  },

  fetchMe: async () => {
    const storeState = useAuthStore.getState()
    return storeState.fetchUser()
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: user !== null,
    })
  },

  clearError: () => {
    set({ error: null })
  },

  initializeAuth: async () => {
    // Check if token exists in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    const userJson = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      // Set token in apiClient header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Parse and restore user from localStorage
      if (userJson) {
        try {
          const user = JSON.parse(userJson)
          set({
            user,
            accessToken: token,
            refreshToken: refreshToken || null,
            isAuthenticated: true,
          })
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
      
      // Verify token is still valid by fetching user
      const storeState = useAuthStore.getState()
      await storeState.fetchUser().catch(() => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        delete apiClient.defaults.headers.common['Authorization']
      })
    }
    
    // Mark hydration as complete
    set({ isHydrated: true })
  },
}))
