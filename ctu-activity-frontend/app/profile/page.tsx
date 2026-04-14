'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader, AlertCircle, LogOut, Calendar, MapPin, CheckCircle, Clock, Edit2, Users, ClipboardCheck, Activity as ActivityIcon, ChevronRight } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/auth-store'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import apiClient from '@/lib/api'
import { TagService, type ITag } from '@/lib/services/tagService'
import { UserInterestService, type IUserInterest } from '@/lib/services/userInterestService'

// Activity interface matching backend response
interface Activity {
  activityId: number
  activityName: string
  activityDescription: string
  startTime?: string
  endTime?: string
  organizingUnit: string
  category: string
  proofStatus: 'PENDING' | 'VERIFIED' | 'CANCELLED'
  proofStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  PENDINGAt: string
  registrationId: string
}

// Format date helper
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Get registration status config
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Đang chờ', color: 'bg-amber-100 text-amber-700', icon: '⏳' }
    case 'VERIFIED':
      return { label: 'Đã điểm danh', color: 'bg-green-100 text-green-700', icon: '✅' }
    case 'REJECTED':
      return { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: '❌' }
    default:
      return { label: status, color: 'bg-gray-100 text-gray-700', icon: '📋' }
  }
}

// Get activity icon based on category
const getCategoryIcon = (category: string) => {
  const lower = category?.toLowerCase() || ''
  if (lower.includes('công nghệ') || lower.includes('tech')) return '💻'
  if (lower.includes('tình nguyện') || lower.includes('volunteer')) return '💚'
  if (lower.includes('học thuật') || lower.includes('academic')) return '📚'
  if (lower.includes('thể thao') || lower.includes('sport')) return '⚽'
  if (lower.includes('văn nghệ') || lower.includes('art') || lower.includes('music')) return '🎵'
  if (lower.includes('kỹ năng') || lower.includes('skill')) return '🎯'
  return '📋'
}

// Get icon bg color based on category
const getCategoryIconBg = (category: string) => {
  const lower = category?.toLowerCase() || ''
  if (lower.includes('công nghệ') || lower.includes('tech')) return 'bg-blue-100 text-blue-600'
  if (lower.includes('tình nguyện') || lower.includes('volunteer')) return 'bg-green-100 text-green-600'
  if (lower.includes('học thuật') || lower.includes('academic')) return 'bg-purple-100 text-purple-600'
  if (lower.includes('thể thao') || lower.includes('sport')) return 'bg-orange-100 text-orange-600'
  if (lower.includes('văn nghệ') || lower.includes('art') || lower.includes('music')) return 'bg-pink-100 text-pink-600'
  if (lower.includes('kỹ năng') || lower.includes('skill')) return 'bg-indigo-100 text-indigo-600'
  return 'bg-gray-100 text-gray-600'
}

// Empty state component
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Clock className="w-8 h-8 text-gray-300" />
    </div>
    <p className="text-gray-400 text-center text-sm">{message}</p>
  </div>
)

// Activity list item component (card style like the design image)
const ActivityListItem = ({
  activity,
}: {
  activity: Activity
}) => {
  const statusConfig = getStatusConfig(activity.proofStatus)
  const categoryIcon = getCategoryIcon(activity.category)
  const categoryIconBg = getCategoryIconBg(activity.category)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl ${categoryIconBg}`}>
          {categoryIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 text-[15px] truncate">{activity.activityName}</h4>
            <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${statusConfig.color} hover:${statusConfig.color}`}>
              {statusConfig.label}
            </Badge>
          </div>

          {activity.activityDescription && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              {activity.activityDescription}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-400">
            {activity.startTime && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(activity.startTime)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{activity.organizingUnit}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Link href={`/activities/${activity.activityId}`}>
          <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors shrink-0 border border-blue-100">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </div>
  )
}

interface UserProfile {
  user_id: string
  email: string
  fullName: string
  studentCode: string
  major?: string
  unitId?: number
  unitName?: string
  avatarUrl?: string
  status?: string
  createdAt?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { isHydrated, user, logout } = useAuthStore()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState({
    fullName: '',
    major: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('PENDING')

  // Interests state
  const [userInterests, setUserInterests] = useState<IUserInterest[]>([])
  const [allTags, setAllTags] = useState<ITag[]>([])
  const [editingInterests, setEditingInterests] = useState(false)
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([])
  const [interestsLoading, setInterestsLoading] = useState(false)

  // Computed: Activities that are PENDING (not checked in yet)
  const PENDINGActivities = useMemo(() => {
    return activities.filter(act => act.proofStatus === 'PENDING')
  }, [activities])

  // Computed: Activities that are VERIFIED
  const checkedInActivities = useMemo(() => {
    return activities.filter(act => act.proofStatus === 'VERIFIED')
  }, [activities])

  // Computed: Activities with APPROVED proof status
  const approvedActivities = useMemo(() => {
    return activities.filter(act => act.proofStatus === 'VERIFIED')
  }, [activities])

  useEffect(() => {
    // console.log('[Profile] Component mounted, checking hydration status...', { isHydrated })
    // console.log('[Profile] User from auth store:', userInterests)
    // if (!isHydrated) return
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch profile
      console.log('[Profile] Fetching user profile')
      const profileRes = await apiClient.get('/users/me/profile')
      console.log('[Profile] Profile response structure:', profileRes)
      const profileData = profileRes.data.data?.user || profileRes.data.user || profileRes.data
      setProfile(profileData)
      setEditData({
        fullName: profileData.fullName || '',
        major: profileData.major || '',
      })

      // Fetch all activities in a single request
      console.log('[Profile] Fetching all user activities')
      const activitiesRes = await apiClient.get('/users/me/activities')
      console.log('[Profile] Activities response structure:', activitiesRes)

      // Extract data from nested structure: response.data.data.data
      const activitiesData = activitiesRes.data?.data?.data || activitiesRes.data?.data || []
      console.log('[Profile] Extracted activities:', activitiesData)

      setActivities(Array.isArray(activitiesData) ? activitiesData : [])

      // Fetch user interests and all tags
      await fetchInterests()
    } catch (err: any) {
      console.error('[Profile] Error fetching profile:', err)
      setError(err.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchInterests = async () => {
    try {
      // Fetch all tags
      const tagsRes = await TagService.CallFetchAllTags()
      console.log('[Profile] All tags response:', tagsRes)
      if (tagsRes?.statusCode === 200) {
        setAllTags(tagsRes.data.data || [])
      }

      // Fetch user interests
      const interestsRes = await UserInterestService.CallGetMyInterests()
      console.log('[Profile] User interests response:', interestsRes)
      if (interestsRes?.statusCode === 200) {
        const interests = (interestsRes.data.data as IUserInterest[]) || []
        setUserInterests(interests)
        console.log('[Profile] User interests set:', interests)
        setSelectedInterestIds(interests.map((i: IUserInterest) => i.tagId))
      }
    } catch (err) {
      console.error('[Profile] Error fetching interests:', err)
    }
  }

  const handleEditInterests = async () => {
    setEditingInterests(true)
    // Reset selected interests to current state
    setSelectedInterestIds(userInterests.map(i => i.tagId))
  }

  const handleSaveInterests = async () => {
    try {
      setInterestsLoading(true)
      const res = await UserInterestService.CallUpdateUserInterests({
        tagIds: selectedInterestIds,
      })
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setUserInterests(res.data || [])
        setEditingInterests(false)
        setError(null)
      }
    } catch (err: any) {
      console.error('[Profile] Error saving interests:', err)
      setError('Failed to save interests')
    } finally {
      setInterestsLoading(false)
    }
  }

  const handleCancelInterests = () => {
    setEditingInterests(false)
    setSelectedInterestIds(userInterests.map(i => i.tagId))
  }

  const toggleInterestTag = (tagId: number) => {
    setSelectedInterestIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleUpdateProfile = async () => {
    try {
      setSubmitting(true)
      console.log('[Profile] Updating profile')
      await apiClient.patch('/users/me/profile', editData)

      setProfile(prev => prev ? { ...prev, ...editData } : null)
      setEditOpen(false)
      setError(null)
    } catch (err: any) {
      console.error('[Profile] Error updating profile:', err)
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      console.error('[Profile] Logout error:', err)
      setError('Failed to logout')
    }
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500 font-medium">Đang khởi tạo...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500 font-medium">Đang tải hồ sơ...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải hồ sơ</h2>
          <p className="text-gray-500 mb-6">{error || 'Đã xảy ra lỗi khi tải thông tin hồ sơ.'}</p>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-8" onClick={() => router.push('/login')}>
            Đăng nhập lại
          </Button>
        </div>
      </div>
    )
  }

  const initials = profile.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <AvatarUpload
                userId={user?.user_id || ''}
                currentAvatarUrl={profile.avatarUrl}
                size="md"
                clickable
                onSuccess={() => {
                  fetchProfileData()
                }}
              />
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white" />
            </div>

            {/* Name & Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">{profile.fullName}</h1>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-bold px-2.5 py-0.5">
                  ✓ Hoạt động
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{profile.email}</span>
                <span className="text-gray-300">|</span>
                <span>MSV: {profile.studentCode}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 rounded-xl border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🎓</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Thông tin học vấn</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Chuyên ngành</p>
                  <p className="text-sm font-bold text-gray-800">{profile.major || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Đơn vị quản lý</p>
                  <p className="text-sm font-bold text-gray-800">{profile.unitName || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PENDING Activities */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-blue-200">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/20 text-white text-[10px] font-bold hover:bg-white/20">Tổng</Badge>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold mb-1">{activities.length}</p>
                <p className="text-blue-100 text-sm font-medium">Hoạt động đã đăng ký</p>
              </div>

              {/* Checked-in Activities */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-emerald-200">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/20 text-white text-[10px] font-bold hover:bg-white/20">Tổng</Badge>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold mb-1">{checkedInActivities.length}</p>
                <p className="text-emerald-100 text-sm font-medium">Đã điểm danh</p>
              </div>
            </div>
          </div>

          {/* Right Column - Interests */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">❤️</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Sở thích</h2>
                </div>
                {!editingInterests && (
                  <button
                    onClick={handleEditInterests}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {!editingInterests ? (
                // Display mode
                <div className="flex flex-wrap gap-2">
                  {userInterests.length > 0 ? (
                    userInterests.map(interest => (
                      <Badge
                        key={interest.id}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 text-xs font-semibold rounded-lg"
                      >
                        {interest.tag?.name || `Tag ${interest.tagId}`}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Bạn chưa chọn sở thích nào. Nhấp vào &apos;Chỉnh sửa&apos; để thêm.
                    </p>
                  )}
                </div>
              ) : (
                // Edit mode
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-3">
                      Chọn các sở thích của bạn:
                    </p>
                    {interestsLoading ? (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Đang tải...</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                          <button
                            key={tag.id}
                            onClick={() => toggleInterestTag(tag.id)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
                              selectedInterestIds.includes(tag.id)
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                            }`}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelInterests}
                      disabled={interestsLoading}
                      className="rounded-lg text-xs"
                    >
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveInterests}
                      disabled={interestsLoading}
                      className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs"
                    >
                      {interestsLoading ? (
                        <>
                          <Loader className="w-3 h-3 mr-1.5 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity History Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Lịch sử hoạt động</h2>
              </div>

              {/* Tab Buttons */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('PENDING')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'PENDING'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đã đăng ký
                </button>
                <button
                  onClick={() => setActiveTab('checkedin')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'checkedin'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đã điểm danh
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'approved'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đã xác nhận
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
              {/* PENDING Tab */}
              {activeTab === 'PENDING' && (
                <>
                  {PENDINGActivities.length > 0 ? (
                    <div className="space-y-3">
                      {PENDINGActivities.map((activity) => (
                        <ActivityListItem key={activity.registrationId} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Chưa có hoạt động nào đã đăng ký" />
                  )}
                </>
              )}

              {/* Checked-in Tab */}
              {/* {activeTab === 'checkedin' && (
                <>
                  {checkedInActivities.length > 0 ? (
                    <div className="space-y-3">
                      {checkedInActivities.map((activity) => (
                        <ActivityListItem key={activity.registrationId} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Chưa có hoạt động nào đã điểm danh" />
                  )}
                </>
              )} */}

              {/* Approved Tab */}
              {activeTab === 'approved' && (
                <>
                  {approvedActivities.length > 0 ? (
                    <div className="space-y-3">
                      {approvedActivities.map((activity) => (
                        <ActivityListItem key={activity.registrationId} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Chưa có hoạt động nào được xác nhận" />
                  )}
                </>
              )}

              {/* View all link */}
              {activities.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Link href="/activities" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group">
                    Xem tất cả hoạt động
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Chỉnh sửa hồ sơ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Họ và tên</Label>
              <Input
                id="fullName"
                value={editData.fullName}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
                placeholder="Nhập họ và tên"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="major" className="text-sm font-semibold text-gray-700">Chuyên ngành</Label>
              <Input
                id="major"
                value={editData.major}
                onChange={(e) =>
                  setEditData({ ...editData, major: e.target.value })
                }
                placeholder="Nhập chuyên ngành"
                className="mt-1.5 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">
              Hủy
            </Button>
            <Button onClick={handleUpdateProfile} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 rounded-xl">
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
