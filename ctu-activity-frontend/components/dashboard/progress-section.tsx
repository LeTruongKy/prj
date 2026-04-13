'use client'

import { Clock, Award } from 'lucide-react'

interface SV5TProgressData {
  user_id: string
  email: string
  full_name: string
  student_code: string
  sv5t_eligible: boolean
  completed_groups: number
  total_groups: number
  overall_progress: number
  groups?: any[]
  calculated_at?: string
}

interface ProgressSectionProps {
  studentProgress: SV5TProgressData | null
}

export default function ProgressSection({ studentProgress }: ProgressSectionProps) {
  // Use overall_progress and completed_groups from SV5TProgressData
  const progressCircle = studentProgress?.overall_progress || 0
  const completedGroups = studentProgress?.completed_groups || 0
  const totalGroups = studentProgress?.total_groups || 5

  // Fallback values if groups data is not available
  let totalActivities = 0
  let maxActivities = 0
  let socialHours = 0
  let certificates = 0

  // Extract from groups array if available
  if (studentProgress?.groups && Array.isArray(studentProgress.groups)) {
    const groups = studentProgress.groups

    // Group 1 - Activities
    if (groups[0]) {
      totalActivities = groups[0].completed_count || 0
      maxActivities = groups[0].required_count || 0
    }

    // Group 2 - Training points (Điểm rèn luyện)
    if (groups[1]) {
      socialHours = groups[1].completed_count || 0
    }

    // Group 3 - Social hours
    if (groups[2]) {
      certificates = groups[2].completed_count || 0
    }
  }

  // Fallback default values
  if (totalActivities === 0) totalActivities = 12
  if (maxActivities === 0) maxActivities = 16
  if (socialHours === 0) socialHours = 24
  if (certificates === 0) certificates = 4

  // Determine ranking based on progress
  const getRanking = () => {
    if (progressCircle >= 90) return 'XUẤT SẮC'
    if (progressCircle >= 75) return 'KHÁ'
    if (progressCircle >= 60) return 'TRUNG BÌNH'
    return 'CẦN CỐ GẮNG'
  }

  const rankingColor = () => {
    if (progressCircle >= 90) return 'text-emerald-600'
    if (progressCircle >= 75) return 'text-blue-600'
    if (progressCircle >= 60) return 'text-amber-600'
    return 'text-red-500'
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="progress">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Tiến độ của tôi
      </h2>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left: Progress Circle */}
          <div className="flex justify-center">
            <div className="relative">
              <svg className="w-44 h-44" viewBox="0 0 120 120">
                {/* Background Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="10"
                />
                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeDasharray={`${(progressCircle / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-blue-600">{Math.round(progressCircle)}%</span>
                <span className="text-xs text-gray-500 mt-1 font-medium">Hoàn thành mục tiêu</span>
                {studentProgress?.calculated_at && (
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Ngày {new Date(studentProgress.calculated_at).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Middle: Progress Bars */}
          <div className="space-y-5">
            {/* Total Activities Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Tổng hoạt động
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {totalActivities} / {maxActivities}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalActivities / maxActivities) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Points Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Điểm rèn luyện
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {socialHours} / 100
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((socialHours / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Ranking */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-widest">XẾP LOẠI RÈN LUYỆN</p>
              <p className={`text-xl font-extrabold ${rankingColor()}`}>{getRanking()}</p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="space-y-4">
            {/* Social Hours Card */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-blue-100 rounded-2xl shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900">{socialHours}h</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Giờ xã hội</p>
                </div>
              </div>
            </div>

            {/* Certificates Card */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-purple-100 rounded-2xl shrink-0">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900">{certificates.toString().padStart(2, '0')}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Chứng nhận</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
