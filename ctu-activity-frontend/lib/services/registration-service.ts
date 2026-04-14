import { apiClient } from '@/lib/api'

export interface Conflict {
  activityId: number
  title: string
  startTime: string
  endTime: string
}

export interface ConflictCheckResponse {
  hasConflict: boolean
  conflicts: Conflict[]
}

export interface RegistrationStatus {
  id: string
  activityId: number
  userId: string
  proofStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  checkInAt?: string
  qrSignature?: string
  proofUrl?: string
  proofSubmittedAt?: string
  verifiedBy?: string
  verifiedAt?: string
  rating?: number
  feedback?: string
  registeredAt: string
  updatedAt: string
}

/**
 * Check for calendar conflicts before registering
 */
export async function checkCalendarConflict(
  activityId: number,
  startTime: Date,
  endTime: Date
): Promise<ConflictCheckResponse> {
  try {
    const response = await apiClient.post('/registrations/check-conflict', {
      activityId,
      startTime,
      endTime,
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to check calendar conflict:', error)
    throw error
  }
}

/**
 * Register user for activity (with optional conflict override)
 */
export async function registerForActivity(
  activityId: number,
  skipConflictCheck?: boolean
): Promise<{
  registered: boolean
  conflicts?: Conflict[]
  registration?: RegistrationStatus
}> {
  try {
    const response = await apiClient.post('/registrations', {
      activityId,
      skipConflictCheck: skipConflictCheck || false,
    })
    const result = response.data.data || response.data;
    console.log('Registration response:', result);
    // ✅ ADD: Track REGISTER interaction (fire-and-forget)
    if (result.message == "User registered activities retrieved successfully") {
      console.log('Tracking register interaction for activity:', activityId);
      trackRegisterInteractionInternal(activityId).catch((error) => {
        // Silently log, don't break response
        console.debug('[Registration Tracking] Failed to track register:', error.message);
      });
    }
    
    return result;
  } catch (error) {
    console.error('Failed to register for activity:', error)
    throw error
  }
}

/**
 * QR Check-in for activity
 */
export async function checkInWithQR(
  activityId: number,
  qrData: string
): Promise<{
  success: boolean
  registrationId: string
  message: string
}> {
  try {
    const response = await apiClient.post(`/qr/${activityId}/check-in`, {
      qrData,
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to check-in with QR:', error)
    throw error
  }
}

/**
 * Upload proof for activity
 */
export async function submitProof(
  registrationId: string,
  proofUrl: string,
  feedback?: string,
  rating?: number
): Promise<RegistrationStatus> {
  try {
    const response = await apiClient.patch(`/registrations/${registrationId}/submit-proof`, {
      proofUrl,
      feedback,
      rating,
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to submit proof:', error)
    throw error
  }
}

/**
 * Get registration details
 */
export async function getRegistrationDetails(registrationId: string): Promise<RegistrationStatus> {
  try {
    const response = await apiClient.get(`/registrations/${registrationId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch registration details:', error)
    throw error
  }
}

/**
 * Format conflict for display
 */
export function formatConflictDisplay(conflict: Conflict): string {
  const start = new Date(conflict.startTime)
  const end = new Date(conflict.endTime)
  
  const startTime = start.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const endTime = end.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  
  return `${conflict.title} (${startTime} - ${endTime})`
}

// ============================================================
// USER INTERACTION TRACKING (for AI recommendations)
// ============================================================

/**
 * Internal: Track REGISTER interaction
 * Called after successful registration
 * Weight: +3 per tag (if activity has tags)
 */

