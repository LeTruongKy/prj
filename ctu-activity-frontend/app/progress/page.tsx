'use client'

import { useState, useEffect } from 'react'
import { Loader, AlertCircle, CheckCircle, Circle, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import apiClient from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

// ============ TypeScript Interfaces ============

interface SV5TCriterion {
  criterion_id: number
  code: string
  name: string
  description: string
  status: 'COMPLETED' | 'PENDING'
}

interface SV5TGroup {
  group_id: number
  group_name: string
  description: string
  required_count: number
  completed_count: number
  progress_percentage: number
  is_completed: boolean
  criteria: SV5TCriterion[]
}

interface SV5TProgressData {
  user_id: string
  email: string
  full_name: string
  student_code: string
  sv5t_eligible: boolean
  completed_groups: number
  total_groups: number
  overall_progress: number
  groups: SV5TGroup[]
  calculated_at: string
}

interface SV5TApiResponse {
  statusCode: number
  message: string
  data: {
    message: string
    data: SV5TProgressData
  }
}

// ============ Helper Functions ============

const getGroupColor = (groupId: number): { bg: string; light: string; icon: string } => {
  const colors: Record<number, { bg: string; light: string; icon: string }> = {
    1: { bg: 'from-red-600 to-red-700', light: 'bg-red-50 dark:bg-red-950', icon: '❤️' },
    2: { bg: 'from-blue-600 to-blue-700', light: 'bg-blue-50 dark:bg-blue-950', icon: '🧠' },
    3: { bg: 'from-green-600 to-green-700', light: 'bg-green-50 dark:bg-green-950', icon: '⚡' },
    4: { bg: 'from-purple-600 to-purple-700', light: 'bg-purple-50 dark:bg-purple-950', icon: '👥' },
    5: { bg: 'from-amber-600 to-amber-700', light: 'bg-amber-50 dark:bg-amber-950', icon: '🏆' },
  }
  return colors[groupId] || { bg: 'from-gray-600 to-gray-700', light: 'bg-gray-50 dark:bg-gray-950', icon: '⭐' }
}

// ============ Group Card Component ============

const GroupCard = ({ group, isExpanded, onToggle }: { group: SV5TGroup; isExpanded: boolean; onToggle: () => void }) => {
  const { bg, light, icon } = getGroupColor(group.group_id)
  
  const colorMap: Record<number, string> = {
    1: 'border-l-red-600 bg-red-50',
    2: 'border-l-blue-600 bg-blue-50',
    3: 'border-l-green-600 bg-green-50',
    4: 'border-l-purple-600 bg-purple-50',
    5: 'border-l-amber-600 bg-amber-50',
  }
  
  const colorClass = colorMap[group.group_id] || 'border-l-gray-600 bg-gray-50'

  return (
    <div className={`border-l-4 rounded-r-lg overflow-hidden bg-white ${colorClass}`}>
      <button
        onClick={onToggle}
        className="w-full text-left hover:bg-gray-50 transition-colors"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* <div className="text-3xl shrink-0">{icon}</div> */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{group.group_name}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0 ml-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{group.progress_percentage}%</p>
              <p className="text-xs text-gray-600">
                {group.completed_count}/{group.required_count}
              </p>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Criteria List (Expanded) */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="space-y-3">
            {group.criteria.map((criterion) => (
              <div
                key={criterion.criterion_id}
                className={`p-4 rounded-lg flex items-start gap-3 border ${
                  criterion.status === 'COMPLETED'
                    ? 'bg-white border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Icon */}
                {/* <div className="shrink-0 mt-0.5">
                  {criterion.status === 'COMPLETED' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div> */}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p
                        className={`font-semibold text-sm ${
                          criterion.status === 'COMPLETED'
                            ? 'text-green-700 line-through'
                            : 'text-gray-800'
                        }`}
                      >
                        {criterion.code}: {criterion.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{criterion.description}</p>
                    </div>
                    <Badge
                      className={
                        criterion.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100 text-xs'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs'
                      }
                    >
                      {criterion.status === 'COMPLETED' ? 'ĐẠT' : 'CHƯA ĐẠT'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ Main Component ============

export default function ProgressPage() {
  const { isHydrated,user } = useAuthStore()
  const [sv5tData, setSv5tData] = useState<SV5TProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([1])) // Expand first group by default

  useEffect(() => {
    if (!isHydrated) return
    fetchSV5TData()
  }, [isHydrated])

  const fetchSV5TData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get(`/users/${user?.user.user_id}/sv5t/progress`)

      // Extract from nested structure: response.data.data.data
      const sv5tProgressData = response.data?.data?.data || response.data?.data || null

      if (!sv5tProgressData) {
        throw new Error('Invalid response structure')
      }

      setSv5tData(sv5tProgressData)
    } catch (err: any) {
      console.error('[Progress] Error fetching SV5T:', err)
      const errorMsg =
        err.response?.data?.message || err.message || 'Không thể tải dữ liệu tiến độ SV5T'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const toggleGroupExpanded = (groupId: number) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  // ============ Loading State ============

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang khởi động ứng dụng...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải tiến độ SV5T...</p>
        </div>
      </div>
    )
  }

  if (error || !sv5tData) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Không thể tải dữ liệu'}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container max-w-5xl mx-auto space-y-8">
        {/* ============ Header Section ============ */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">Tiến Độ Sinh Viên 5 Tốt</h1>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">{sv5tData.full_name}</span> • MSSV: {sv5tData.student_code}
            </p>
          </div>
          <Badge
            className={`text-sm px-4 py-2.5 font-semibold ${
              sv5tData.sv5t_eligible
                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {sv5tData.sv5t_eligible ? 'DỰ ĐIỀU KIỆN' : 'CHƯA ĐỦ'}
          </Badge>
        </div>

        {/* ============ Stats Cards Section ============ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 font-medium mb-2">TỔNG TIẾN ĐỘ</p>
            <p className="text-3xl font-bold text-blue-600">{sv5tData.overall_progress}%</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 font-medium mb-2">SỐ TIÊU CHÍ HOÀN THÀNH</p>
            <p className="text-3xl font-bold text-blue-600">
              {sv5tData.completed_groups}/{sv5tData.total_groups}
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 font-medium mb-2">TIÊU CHÍ TRUNG BÌNH</p>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(
                sv5tData.groups.reduce((sum, g) => sum + g.progress_percentage, 0) /
                  sv5tData.groups.length
              )}%
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 font-medium mb-2">TRẠNG THÁI SV5T</p>
            <p className={`text-3xl font-bold ${sv5tData.sv5t_eligible ? 'text-green-600' : 'text-red-600'}`}>
              {sv5tData.sv5t_eligible ? 'Đạt xét' : 'Chưa xét'}
            </p>
          </div>
        </div>

        {/* ============ Overall Progress Bar ============ */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tiến độ tổng thể hệ thống</h3>
              <p className="text-sm text-gray-600">Đạt từng tiêu chí để được phép duyệt</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{sv5tData.overall_progress}%</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${sv5tData.overall_progress}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-xs text-gray-600 font-medium">
            <span>KHỞI ĐẦU</span>
            <span className="ml-auto">CẬP NHẬT LẦN CUỐI: {new Date(sv5tData.calculated_at).toLocaleDateString('vi-VN')}</span>
            <span>HOÀN THÀNH</span>
          </div>
        </div>

        {/* ============ Groups Section ============ */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Chi tiết các tiêu chí</h2>
          <div className="space-y-4">
            {sv5tData.groups.map((group) => (
              <GroupCard
                key={group.group_id}
                group={group}
                isExpanded={expandedGroups.has(group.group_id)}
                onToggle={() => toggleGroupExpanded(group.group_id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
