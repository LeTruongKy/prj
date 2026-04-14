import axios, { AxiosInstance, AxiosError } from 'axios'
import { useApiStatusStore } from './api-status-store'
import { toast } from '@/hooks/use-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Important for httpOnly cookies
})

// Request interceptor to add JWT token (fresh from localStorage every time)
apiClient.interceptors.request.use(
  (config) => {
    // Always get fresh token from localStorage to avoid race conditions
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    // Only attach Authorization header if token exists and is not null/undefined/"undefined"
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and network errors
apiClient.interceptors.response.use(
  (response) => {
    // Connection successful
    useApiStatusStore.getState().setConnected(true)
    useApiStatusStore.getState().setMockMode(false)
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Check if it's a network error
    if (!error.response || (error.code && ['ECONNABORTED', 'ENOTFOUND', 'ECONNREFUSED', 'ERR_NETWORK'].includes(error.code))) {
      // Update API status to disconnected
      useApiStatusStore.getState().setConnected(false)
      
      // Show toast notification
      if (typeof window !== 'undefined') {
        toast({
          title: 'Backend Offline',
          description: 'Backend is offline. Please check your connection.',
          variant: 'destructive',
        })
      }
      
      return Promise.reject(error)
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
    }

    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        delete apiClient.defaults.headers.common['Authorization']
        window.location.href = '/login'
      }
      
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default apiClient

