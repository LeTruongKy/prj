'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { checkInViaQr } from '@/lib/services/checkin-service'

export default function CheckInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isHydrated } = useAuthStore()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Đang xác thực...')

  // Get query params from URL
  const activityId = searchParams.get('activityId')
  const timestamp = searchParams.get('timestamp')
  const signature = searchParams.get('signature')
  const performCheckIn = async () => {
      try {
        // 1. Check if user is logged in
        if (!isAuthenticated) {
          // Not logged in - redirect to login with return URL
          const returnUrl = `/checkin?activityId=${activityId}&timestamp=${timestamp}&signature=${signature}`
          router.push(`/login?return=${encodeURIComponent(returnUrl)}`)
          return
        }

        // 2. Validate query params
        if (!activityId || !timestamp || !signature) {
          setStatus('error')
          setMessage('QR code không hợp lệ: thiếu thông tin')
          return
        }

        // 3. Call backend check-in API
        const response = await checkInViaQr(
          parseInt(activityId),
          parseInt(timestamp),
          signature,
        )

        // 4. Success
        setStatus('success')
        setMessage('✓ Check-in thành công!')

        // Redirect to activity page after 2 seconds
        setTimeout(() => {
          router.push(`/activities/${activityId}`)
        }, 2000)
      } catch (error: any) {
        setStatus('error')
        const errorMessage = error?.response?.data?.message || 'QR không hợp lệ'
        setMessage(`✗ Lỗi: ${errorMessage}`)
        
        console.error('Check-in error:', error)
      }
    }
  useEffect(() => {
    if (!isHydrated) return
    performCheckIn()

  }, [isAuthenticated, isHydrated]) // Run when auth state is ready

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Loading State */}
        {status === 'loading' && (
          <>
            <div className="mb-4">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">{message}</p>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <div className="mb-4 text-5xl">✓</div>
            <p className="text-green-600 dark:text-green-400 font-medium text-lg">{message}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Chuyển hướng...</p>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <div className="mb-4 text-5xl">✗</div>
            <p className="text-red-600 dark:text-red-400 font-medium text-lg">{message}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-medium"
              >
                Quay lại
              </button>
              <button
                onClick={() => router.push('/activities')}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:shadow-lg transition font-medium"
              >
                Danh sách
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
