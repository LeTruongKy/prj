import { apiClient } from '@/lib/api'

export interface Activity {
  id: number
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  maxParticipants: number
  qrCodeUrl?: string
  qrExpiration?: string
  requiresProof: boolean
  pointsValue: number
  status: string
}

export interface QRCheckInResult {
  success: boolean
  registrationId: string
  message: string
  activity?: Activity
}

/**
 * Get activity QR code
 */
export async function getActivityQRCode(activityId: number): Promise<{
  activityId: number
  qrCodeUrl: string
  qrExpiration: string
  requiresProof: boolean
}> {
  try {
    const response = await apiClient.get(`/activities/${activityId}/qr`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch activity QR code:', error)
    throw error
  }
}

/**
 * Process QR check-in
 */
export async function processQRCheckIn(
  activityId: number,
  qrData: string
): Promise<QRCheckInResult> {
  try {
    const response = await apiClient.post(`/qr/${activityId}/check-in`, {
      qrData,
    })
    return response.data.data || response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message
    throw new Error(errorMessage || 'QR check-in failed')
  }
}

/**
 * Validate QR data format
 */
export function validateQRData(qrData: string): boolean {
  // QR data format: activityId:secret:expiration:signature
  const parts = qrData.split(':')
  return parts.length === 4 && !isNaN(parseInt(parts[0]))
}

/**
 * Parse QR data
 */
export function parseQRData(qrData: string): {
  activityId: number
  secret: string
  expiration: number
  signature: string
} | null {
  try {
    const [activityId, secret, expirationStr, signature] = qrData.split(':')
    return {
      activityId: parseInt(activityId),
      secret,
      expiration: parseInt(expirationStr),
      signature,
    }
  } catch {
    return null
  }
}

/**
 * Check if QR has expired
 */
export function isQRExpired(expirationMs: number): boolean {
  return new Date().getTime() > expirationMs
}

/**
 * Format QR check-in status
 */
export function formatCheckInStatus(status: string): {
  label: string
  color: string
  icon: string
} {
  switch (status) {
    case 'VERIFIED':
      return { label: 'Đã xác nhận', color: 'green', icon: '✓' }
    case 'PENDING':
      return { label: 'Đang chờ', color: 'yellow', icon: '⏳' }
    case 'REJECTED':
      return { label: 'Bị từ chối', color: 'red', icon: '✕' }
    default:
      return { label: 'Không xác định', color: 'gray', icon: '?' }
  }
}

/**
 * Calculate check-in window
 */
export function getCheckInWindow(startTime: string): {
  isOpen: boolean
  minutesUntilStart: number
  minutesSinceStart: number
} {
  const start = new Date(startTime)
  const now = new Date()
  const diffMs = start.getTime() - now.getTime()
  const diffMinutes = diffMs / (1000 * 60)

  return {
    isOpen: Math.abs(diffMinutes) <= 15, // ±15 minutes from start
    minutesUntilStart: Math.ceil(diffMinutes),
    minutesSinceStart: Math.ceil(-diffMinutes),
  }
}
