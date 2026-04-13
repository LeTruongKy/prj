import apiClient from './api'

export interface Activity {
  activity_id: number
  title: string
  description: string
  category: {
    category_id: number
    name: string
    color: string
  }
  unit: {
    unit_id: number
    name: string
  }
  location: string
  posterUrl?: string | null
  start_time: string
  end_time: string
  max_participants: number
  registration_count: number
  status: string
  approvedBy?: {
    user_id: string
    fullName: string
  }
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

// Placeholder image for activities without poster
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"

export interface ActivityDetail extends Activity {
  registrations?: Registration[]
}

export interface Registration {
  registration_id: number
  user_id: string
  activity_id: number
  status: string
  check_in_at?: string
  proof_status: string
  proof_url?: string
  createdAt: string
}

export interface Category {
  category_id: number
  name: string
  color: string
  activityCount?: number
}

export interface Criteria {
  criteria_id: number
  name: string
  description?: string
  group_id?: number
  requiredActivities?: number
}

export interface CriteriaGroup {
  group_id: number
  groupName: string
  groupDescription?: string
  criteria: Criteria[]
}

export interface StudentProgress {
  user_id: string
  studentCode: string
  fullName: string
  overall_progress: number
  sv5t_eligible: boolean
  criteria_groups: CriteriaGroupProgress[]
  last_activity_verification?: string
}

export interface CriteriaGroupProgress {
  group_id: number
  groupName: string
  progress: number
  completed: boolean
  criteria: CriteriaProgress[]
}

export interface CriteriaProgress {
  criteria_id: number
  name: string
  status: string
  required?: number
  current?: number
}

export interface Unit {
  unit_id: number
  name: string
  type: string
  parentId?: number
  children?: Unit[]
}

// Activity endpoints
export async function getActivities(
  page: number = 1,
  limit: number = 20,
  filters?: {
    search?: string
    categoryId?: number
    unitId?: number
    status?: string
    expand?: string
    sortBy?: string
    order?: string
  }
) {
  const params: any = {
    page,
    limit,
    expand: filters?.expand || 'category,unit',
    ...filters,
  }

  const response = await apiClient.get('/activities', { params })
  return response.data
}

export async function getActivityById(id: number) {
  const response = await apiClient.get(`/activities/${id}`, {
    params: { expand: 'category,unit,registrations' },
  })
  return response.data
}

export async function createActivity(data: {
  title: string
  description: string
  categoryId: number
  unitId: number
  location?: string
  startTime: string
  endTime: string
  maxParticipants?: number
}) {
  const response = await apiClient.post('/activities', data)
  return response.data
}

export async function updateActivityStatus(
  id: number,
  status: string,
  reason?: string
) {
  const response = await apiClient.patch(`/activities/${id}/status`, {
    status,
    ...(reason && { reason }),
  })
  return response.data
}

// Category endpoints
export async function getCategories() {
  const response = await apiClient.get('/categories')
  return response.data
}

// Units endpoints
export async function getUnits(filters?: {
  expand?: string
  parentId?: number
  type?: string
}) {
  const params: any = { expand: 'children', ...filters }
  const response = await apiClient.get('/units', { params })
  return response.data
}

// Registration endpoints
export async function registerActivity(activityId: number) {
  const response = await apiClient.post('/registrations', {
    activityId,
  })
  return response.data
}

export async function checkInActivity(registrationId: number, qrToken: string) {
  const response = await apiClient.patch(`/registrations/${registrationId}/check-in`, {
    qrToken,
  })
  return response.data
}

export async function submitProof(
  registrationId: string,
  proofUrl: string,
  description?: string
) {
  const response = await apiClient.patch(`/registrations/${registrationId}/proof`, {
    proofUrl,
    ...(description && { description }),
  })
  return response.data
}

/**
 * Get all activities a user has registered for
 * @param userId - User ID
 * @param status - Optional filter by registration status
 */
export async function getUserRegisteredActivities(
  userId: string,
  status?: 'REGISTERED' | 'CHECKED_IN' | 'CANCELLED'
) {
  const params: any = {}
  if (status) {
    params.status = status
  }
  const response = await apiClient.get(`/registrations/user/${userId}`, { params })
  return response.data
}

/**
 * Get all participants of an activity (Admin only)
 * @param activityId - Activity ID
 */
export async function getActivityParticipants(activityId: number) {
  const response = await apiClient.get(`/registrations/activity/${activityId}`)
  return response.data
}

// Criteria endpoints
export async function getCriteria(filters?: {
  expand?: string
  groupId?: number
}) {
  const params: any = filters
  const response = await apiClient.get('/criteria', { params })
  return response.data
}

// Student progress endpoints
export async function getStudentProgress(expand?: string) {
  const params: any = {}
  if (expand) params.expand = expand
  const response = await apiClient.get('/students/progress', { params })
  return response.data
}

// Verify proof (admin)
export async function verifyProof(
  registrationId: number,
  action: 'VERIFIED' | 'REJECTED',
  rating?: number,
  feedback?: string
) {
  const response = await apiClient.patch(`/registrations/${registrationId}/verify`, {
    action,
    ...(rating !== undefined && { rating }),
    ...(feedback && { feedback }),
  })
  return response.data
}
