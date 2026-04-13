import axios, { AxiosInstance, AxiosError } from 'axios'
import { useApiStatusStore } from '@/lib/api-status-store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:8080'

// Create axios instance with base config
const privateAxios: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
})

// Request interceptor to add JWT token from localStorage
privateAxios.interceptors.request.use(
  (config) => {
    // Get fresh token from localStorage every time
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth_token')
        : null

    // Only attach Authorization header if token exists
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle responses and network errors
privateAxios.interceptors.response.use(
  (response) => {
    // Connection successful
    useApiStatusStore.getState().setConnected(true)
    return response.data
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any

    // Check if it's a network error
    if (
      !error.response ||
      (error.code &&
        [
          'ECONNABORTED',
          'ENOTFOUND',
          'ECONNREFUSED',
          'ERR_NETWORK',
        ].includes(error.code))
    ) {
      useApiStatusStore.getState().setConnected(false)
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized (token expired, etc.)
    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/auth/login' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            timeout: 5000,
          }
        )

        const newToken = refreshResponse.data?.data?.accessToken
        if (newToken) {
          localStorage.setItem('auth_token', newToken)
          privateAxios.defaults.headers.common['Authorization'] =
            `Bearer ${newToken}`
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return privateAxios(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default privateAxios
