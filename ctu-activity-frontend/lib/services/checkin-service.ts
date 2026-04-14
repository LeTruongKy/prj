import { apiClient } from '@/lib/api'

/**
 * Check-in via QR code with signature verification
 * 
 * @param activityId - Activity ID from QR
 * @param timestamp - Timestamp from QR
 * @param signature - HMAC-SHA256 signature from QR
 * @returns Check-in response from backend
 */
export async function checkInViaQr(
  activityId: number,
  timestamp: number,
  signature: string,
) {
  const response = await apiClient.post('/registrations/check-in', {
    activityId,
    timestamp,
    signature,
  })
  return response.data
}
