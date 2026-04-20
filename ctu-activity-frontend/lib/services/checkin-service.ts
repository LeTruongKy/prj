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
  
async function trackCheckInInteractionInternal(activityId: number) {
  try {
    await apiClient.post('/user-interactions/check-in', {
      activityId,
    });
  } catch (error) {
    // Silently fail - don't break the main request
    console.debug('[Tracking] checkin tracking error:', error);
  }
}
  const response = await apiClient.post('/registrations/check-in', {
    activityId,
    timestamp,
    signature,
  })
  if (response) {
      trackCheckInInteractionInternal(activityId).catch((error) => {
        // Silently log, don't break response
        console.debug('[Registration Tracking] Failed to track register:', error.message);
      });
    }
  return response.data
}
