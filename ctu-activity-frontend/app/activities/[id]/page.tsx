
'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, Users, AlertCircle, Loader, Download, ChevronRight, Calendar, Building2, ArrowLeft, Share2, Heart, ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuthStore } from '@/lib/auth-store'
import { ProofUploadModal } from '@/components/proof-upload-modal'
import { RegisterConfirmationModal } from '@/components/register-confirmation-modal'
import {
  getActivityById,
  registerActivity,
  getUserRegisteredActivities,
  getActivities,
  Activity,
} from '@/lib/activity-service'

function formatDateTime(dateString: string | undefined | null): string {
  try {
    if (!dateString) {
      return 'Đang cập nhật...'
    }

    // Handle both string and Date instances
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Đang cập nhật...'
    }

    // Format as: dd/MM/yyyy HH:mm in Vietnamese timezone
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return formatter.format(date)
  } catch {
    return 'Đang cập nhật...'
  }
}

// Check if activity is expired
function isActivityExpired(endTime: string): boolean {
  return new Date(endTime) < new Date()
}


export default function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { user, isAuthenticated } = useAuthStore()

  const [activity, setActivity] = useState<Activity | null>(null)
  const [similarActivities, setSimilarActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [registering, setRegistering] = useState(false)
  const [showProofDialog, setShowProofDialog] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  // Fetch activity details
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        const data = await getActivityById(parseInt(resolvedParams.id))
        console.log('Fetched activity details:321321', data)
        const activityData = data.data?.activity || data
        setActivity(activityData)
        setError(null)

        // Fetch similar activities (same category)
        if (activityData.category.category_id) {
          try {
            const response = await getActivities(1, 6, {
              status: 'PUBLISHED',
              categoryId: activityData.category.category_id,
              expand: 'category,unit'
            })
            console.log(response)
            const allActivities = response.data?.data || []
            // Filter out current activity and limit to 3
            const similar = allActivities
              .filter((a: Activity) => a.activity_id !== activityData.activity_id)
              .slice(0, 3)
            setSimilarActivities(similar)
          } catch (err) {
            console.error('Error fetching similar activities:', err)
            setSimilarActivities([])
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load activity details')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [resolvedParams.id])

  // Check if user is registered and get registration details
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!user) return

      try {
        const activityId = parseInt(resolvedParams.id)
        console.log(user)
        const response = await getUserRegisteredActivities(user.user.user_id)

        const userActivities = response.data.data || []

        // Find the current activity in user's registered activities using activityId from params
        const currentActivityReg = userActivities.find(
          (reg: any) => reg.activityId === activityId
        )

        if (currentActivityReg) {
          setIsRegistered(true)
          setRegistrationId(currentActivityReg.registrationId)
        } else {
          setIsRegistered(false)
          setRegistrationId(null)
        }
      } catch (err) {
        setIsRegistered(false)
        setRegistrationId(null)
      }
    }

    checkUserRegistration()
  }, [user, resolvedParams.id])

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Open confirmation modal instead of directly registering
    setRegisterError(null)
    setShowConfirmModal(true)
  }

  const handleConfirmRegister = async () => {
    try {
      setRegistering(true)
      setRegisterError(null)

      const response = await registerActivity(parseInt(resolvedParams.id))

      // Get registration ID from response
      if (response.registration?.id) {
        setRegistrationId(response.registration.id)
      }

      setIsRegistered(true)
      setActivity((prev) =>
        prev
          ? {
            ...prev,
            registration_count: prev.registration_count + 1,
          }
          : null
      )

      // Close modal on success
      setShowConfirmModal(false)

      // Double-check by calling API
      if (user) {
        const checkResponse = await getUserRegisteredActivities(user.user.user_id)
        console.log('User registered activities after registration:', checkResponse.data)
        const userActivities = checkResponse.data?.data || []
        const newReg = userActivities.find(
          (reg: any) => reg.activityId === parseInt(resolvedParams.id)
        )
        if (newReg) {
          setRegistrationId(newReg.registrationId)
        }
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      setRegisterError(message)
    } finally {
      setRegistering(false)
    }
  }

  const handleSubmitProof = async () => {
    // Refresh activity data and re-check registration status
    try {
      const data = await getActivityById(parseInt(resolvedParams.id))
      setActivity(data.data?.activity || data)

      // Also refresh user registration status
      if (user) {
        const response = await getUserRegisteredActivities(user.user.user_id)
        const userActivities = response.data?.data || []
        const updatedReg = userActivities.find(
          (reg: any) => reg.activityId === parseInt(resolvedParams.id)
        )
        if (updatedReg) {
          setRegistrationId(updatedReg.registrationId)
        }
      }
    } catch (err) {
      // Error already shown in modal, just refresh state
    }
  }

  // Loading skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500 font-medium">Đang tải chi tiết hoạt động...</p>
        </div>
      </div>
    )
  }

  // Error UI
  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy hoạt động</h2>
          <p className="text-gray-500 mb-6">{error || 'Hoạt động này không tồn tại hoặc đã bị xóa.'}</p>
          <Link href="/activities">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">Quay lại danh sách hoạt động</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate days remaining
  const expired = isActivityExpired(activity?.end_time || '')
  const startDate = new Date(activity?.start_time || '')
  const endDate = new Date(activity?.end_time || '')
  const today = new Date()
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Registration progress
  const registrationPercent = activity?.max_participants
    ? Math.min(100, Math.round(((activity?.registration_count || 0) / activity.max_participants) * 100))
    : 0

  // Main content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Back */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link href="/activities" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại danh sách
            </Link>
            <div className="flex items-center gap-2">
              {activity?.category && (
                <Badge
                  className="text-white text-xs font-bold px-3 py-1 uppercase tracking-wide"
                  style={{ backgroundColor: activity.category?.color || '#3b5feb' }}
                >
                  {activity.category?.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Image - Left */}
            <div className="lg:col-span-3">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
                {/* Expired overlay on image */}
                {expired && (
                  <div className="absolute inset-0 bg-black/40 z-[5] flex items-center justify-center">
                    <div className="bg-red-500/90 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-xl shadow-lg border border-red-400/50 flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5" />
                      Hoạt động đã kết thúc
                    </div>
                  </div>
                )}
                {activity?.poster_url ? (
                  <Image
                    src={activity.poster_url}
                    alt={activity.title}
                    fill
                    className="w-full h-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-blue-300 mb-3" />
                    <span className="text-blue-400 text-sm font-medium">Không có hình ảnh</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info - Right */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {expired ? (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 px-3 py-1 text-xs font-bold">
                    ⛔ Đã kết thúc
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3 py-1 text-xs font-bold">
                    🟢 Đang diễn ra
                  </Badge>
                )}
                {daysRemaining > 0 && !expired && (
                  <span className="text-xs text-gray-500 font-medium">Còn {daysRemaining} ngày</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                {activity?.title}
              </h1>

              {/* Error alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Thời gian</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {formatDateTime(activity?.start_time)} — {formatDateTime(activity?.end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Địa điểm</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{activity?.location || 'Đang cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Đơn vị tổ chức</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{activity?.unit?.name || 'Đang cập nhật'}</p>
                  </div>
                </div>
              </div>

              {/* Participants Progress */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Đã đăng ký</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {activity?.registration_count || 0}/{activity?.max_participants || '∞'}
                  </span>
                </div>
                {activity?.max_participants && activity.max_participants > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${registrationPercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {expired ? (
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed border border-gray-200"
                >
                  Hoạt động đã kết thúc
                </button>
              ) : !isRegistered ? (
                <Button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all h-auto text-sm"
                >
                  {registering ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Đang đăng ký...
                    </span>
                  ) : (
                    'Đăng ký tham gia'
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button disabled className="w-full rounded-xl h-auto py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold text-sm" variant="outline">
                    ✓ Đã đăng ký thành công
                  </Button>

                  <Button
                    onClick={() => setShowProofDialog(true)}
                    variant="outline"
                    className="w-full rounded-xl h-auto py-3 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Nộp minh chứng tham gia
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Giới thiệu hoạt động</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {activity?.description || 'Đang cập nhật...'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Info Recap - Sticky */}
            <div className="sticky top-24 space-y-4">
              {/* Activity Info Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thông tin chi tiết</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <span className="text-lg mt-0.5">📅</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Ngày bắt đầu</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {activity?.start_time
                          ? new Date(activity.start_time).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                          : 'Đang cập nhật'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <span className="text-lg mt-0.5">🏁</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Ngày kết thúc</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {activity?.end_time
                          ? new Date(activity.end_time).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                          : 'Đang cập nhật'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <span className="text-lg mt-0.5">⏰</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Thời gian</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {activity?.start_time
                          ? new Date(activity.start_time).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          : 'Đang cập nhật'}{' '}
                        —{' '}
                        {activity?.end_time
                          ? new Date(activity.end_time).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          : 'Đang cập nhật'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <span className="text-lg mt-0.5">📍</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Địa điểm</p>
                      <p className="text-sm font-semibold text-gray-800">{activity?.location || 'Đang cập nhật'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">🏢</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Đơn vị tổ chức</p>
                      <p className="text-sm font-semibold text-gray-800">{activity?.unit?.name || 'Đang cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className={`rounded-2xl p-5 border ${expired ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expired ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <Clock className={`w-5 h-5 ${expired ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${expired ? 'text-red-700' : 'text-blue-700'}`}>
                      {expired ? 'Hoạt động đã kết thúc' : `Còn ${daysRemaining} ngày đăng ký`}
                    </p>
                    <p className={`text-xs ${expired ? 'text-red-500' : 'text-blue-500'}`}>
                      {expired ? 'Không thể đăng ký tham gia' : 'Hãy đăng ký sớm để giữ chỗ!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Activities */}
        {similarActivities.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Hoạt động tương tự</h2>
              </div>
              <Link href="/activities" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium group">
                Xem tất cả <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarActivities.map((sim) => {
                const simExpired = isActivityExpired(sim.end_time)

                return (
                  <Link key={sim.activity_id} href={`/activities/${sim.activity_id}`}>
                    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                      {/* Image */}
                      <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                        {simExpired && (
                          <div className="absolute inset-0 bg-black/40 z-[5] flex items-center justify-center">
                            <div className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Đã hết hạn
                            </div>
                          </div>
                        )}
                        {sim.poster_url ? (
                          <Image
                            src={sim.poster_url}
                            alt={sim.title}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-blue-300 mb-1" />
                            <span className="text-xs text-blue-400">Không có hình</span>
                          </div>
                        )}
                        {/* Category badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <Badge
                            className="text-white capitalize text-xs font-bold shadow-md"
                            style={{ backgroundColor: sim.category?.color || '#3b5feb' }}
                          >
                            {sim.category?.name || 'Hoạt động'}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors text-[15px]">
                          {sim.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                          {sim.description}
                        </p>
                        <div className="space-y-1.5 text-xs text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span>{new Date(sim.start_time).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span className="line-clamp-1">{sim.location || 'Đang cập nhật'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Proof Upload Modal */}
      {registrationId && (
        <ProofUploadModal
          open={showProofDialog}
          onOpenChange={setShowProofDialog}
          registrationId={registrationId}
          onSuccess={handleSubmitProof}
        />
      )}

      {/* Registration Confirmation Modal */}
      {activity && (
        <RegisterConfirmationModal
          activity={activity}
          isOpen={showConfirmModal}
          onConfirm={handleConfirmRegister}
          onCancel={() => {
            setShowConfirmModal(false)
            setRegisterError(null)
          }}
          isLoading={registering}
          error={registerError}
        />
      )}
    </div>
  )
}