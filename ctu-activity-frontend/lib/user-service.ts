import apiClient from './api'

export interface User {
  user_id: string
  email: string
  fullName: string
  studentCode: string
  major?: string
  unitId?: number
  unitName?: string
  avatarUrl?: string
  role: string
  status: string
  createdAt?: string
}

export interface UserRegistration {
  registration_id: number
  user_id: string
  activity_id: number
  activity?: {
    activity_id: number
    title: string
    category: {
      category_id: number
      name: string
      color: string
    }
    start_time: string
    end_time: string
  }
  status: string
  check_in_at?: string
  proof_status: string
  proof_url?: string
  created_at: string
}

// Get current user profile
export async function getCurrentUser() {
  const response = await apiClient.get('/users/me/profile')
  return response.data.data.user
}

// Update user profile
export async function updateUserProfile(data: {
  fullName?: string
  major?: string
  avatarUrl?: string
}) {
  const response = await apiClient.patch('/users/me/profile', data)
  return response.data.data.user
}

// Get user registrations
export async function getUserRegistrations(expand?: string) {
  const params: any = {}
  if (expand) params.expand = expand
  const response = await apiClient.get('/registrations', { params })
  return response.data
}
