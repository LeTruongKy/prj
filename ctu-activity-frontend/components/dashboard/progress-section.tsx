'use client'

import Link from 'next/link'
import { Clock, Award, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'

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
  const progressCircle = studentProgress?.overall_progress || 0
  const completedGroups = studentProgress?.completed_groups || 0
  const totalGroups = studentProgress?.total_groups || 5

  let totalActivities = 0
  let maxActivities = 0
  let socialHours = 0
  let certificates = 0

  if (studentProgress?.groups && Array.isArray(studentProgress.groups)) {
    const groups = studentProgress.groups
    if (groups[0]) { totalActivities = groups[0].completed_count || 0; maxActivities = groups[0].required_count || 0 }
    if (groups[1]) { totalActivities += groups[1].completed_count || 0; maxActivities += groups[1].required_count || 0 }
    if (groups[2]) { totalActivities += groups[2].completed_count || 0; maxActivities += groups[2].required_count || 0 }
    if (groups[3]) { totalActivities += groups[3].completed_count || 0; maxActivities += groups[3].required_count || 0 }
    if (groups[4]) { totalActivities += groups[4].completed_count || 0; maxActivities += groups[4].required_count || 0 }
  }

  if (totalActivities === 0) totalActivities = 12
  if (maxActivities === 0) maxActivities = 8
  if (socialHours === 0) socialHours = 24
  if (certificates === 0) certificates = 4

  const getRanking = () => {
    if (progressCircle >= 90) return { label: 'XUẤT SẮC', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
    if (progressCircle >= 75) return { label: 'KHÁ', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
    if (progressCircle >= 60) return { label: 'TRUNG BÌNH', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    return { label: 'CẦN CỐ GẮNG', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
  }

  const ranking = getRanking()

  const circumference = 2 * Math.PI * 52
  const strokeDasharray = `${(progressCircle / 100) * circumference} ${circumference}`

  const progressBars = [
    {
      label: 'Tổng hoạt động',
      value: totalActivities,
      max: maxActivities,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Nhóm hoàn thành',
      value: completedGroups,
      max: totalGroups,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-100',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16" id="progress">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
              SV5T - Tiêu Chuẩn Rèn Luyện
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Tiến độ Sinh Viên 5 Tốt
            </h2>
            <p className="text-gray-500 mt-2 text-base">
              Theo dõi hành trình phấn đấu của bạn
            </p>
          </div>
          <Link
            href="/progress"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-lg shadow-md shrink-0"
          >
            Xem chi tiết
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Column 1: Circle Progress */}
            <div className="flex flex-col items-center justify-center p-8 sm:p-10 gap-4">
              <div className="relative">
                {/* Outer glow ring */}
                <div
                  className="absolute inset-0 rounded-full blur-lg opacity-30"
                  style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }}
                />
                <svg className="w-48 h-48 relative" viewBox="0 0 120 120">
                  {/* Track */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  {/* Secondary track accent */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e0e7ff" strokeWidth="5" />
                  {/* Progress */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-blue-700">{Math.round(progressCircle)}%</span>
                  <span className="text-xs text-gray-500 mt-1 font-medium text-center px-2">Hoàn thành</span>
                </div>
              </div>

              {/* Ranking Badge */}
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border ${ranking.bg} ${ranking.border}`}>
                <CheckCircle2 className={`w-4 h-4 ${ranking.color}`} />
                <span className={`font-extrabold text-sm tracking-wide ${ranking.color}`}>
                  {ranking.label}
                </span>
              </div>

              {/* SV5T Badge */}
              {studentProgress?.sv5t_eligible && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-5 py-2 rounded-xl shadow-md">
                  <span className="text-base">🏆</span>
                  <span className="font-bold text-sm">Đạt SV5T</span>
                </div>
              )}
            </div>

            {/* Column 2: Progress Bars */}
            <div className="p-8 sm:p-10 space-y-6">
              <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Chi tiết tiến độ
              </h3>
              {progressBars.map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm font-semibold text-gray-700">{bar.label}</span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                      {bar.value} / {bar.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${bar.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${Math.min((bar.value / bar.max) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(Math.min((bar.value / bar.max) * 100, 100))}% hoàn thành
                  </p>
                </div>
              ))}

              {studentProgress?.calculated_at && (
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Cập nhật lúc: {new Date(studentProgress.calculated_at).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>

            {/* Column 3: Stats Cards */}
          
          </div>
        </div>
      </div>
    </section>
  )
}
