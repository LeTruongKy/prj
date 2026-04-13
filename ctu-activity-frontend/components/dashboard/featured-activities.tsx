'use client'

import Link from 'next/link'
import Image from 'next/image'

export interface ActivityData {
  id: number | string
  title: string
  description: string
  category_id?: number | string
  category_name?: string
  start_date?: string
  end_date?: string
  location?: string
  poster_url?: string | null
  participant_count?: number
  status?: string
}

interface FeaturedActivitiesProps {
  activities: ActivityData[]
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

const categoryColors: Record<string, string> = {
  'TÌNH NGUYỆN': 'bg-emerald-500',
  'HỌC THUẬT': 'bg-blue-500',
  'THỂ THAO': 'bg-orange-500',
  'VĂN NGHỆ': 'bg-purple-500',
  'KỸ NĂNG': 'bg-pink-500',
}

const getCategoryColor = (name?: string): string => {
  if (!name) return 'bg-blue-500'
  const upper = name.toUpperCase()
  for (const [key, value] of Object.entries(categoryColors)) {
    if (upper.includes(key)) return value
  }
  return 'bg-blue-500'
}

export default function FeaturedActivities({ activities }: FeaturedActivitiesProps) {
  if (!activities || activities.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hoạt động sắp tới
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Đừng bỏ lỡ các sự kiện quan trọng trong tuần này
            </p>
          </div>
          <Link
            href="/activities"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
          >
            Xem tất cả <span>→</span>
          </Link>
        </div>
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
          Hiện không có hoạt động nào
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Hoạt động sắp tới
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Đừng bỏ lỡ các sự kiện quan trọng trong tuần này
          </p>
        </div>
        <Link
          href="/activities"
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
        >
          Xem tất cả <span>→</span>
        </Link>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.slice(0, 6).map((activity) => (
          <Link key={activity.id} href={`/activities/${activity.id}`}>
            <div className="h-full cursor-pointer group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Image Container */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {/* Category Badge */}
                {activity.category_name && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`${getCategoryColor(activity.category_name)} text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider inline-block shadow-sm`}
                    >
                      {activity.category_name}
                    </span>
                  </div>
                )}

                {/* Points Badge */}
                <div className="absolute bottom-3 right-3 z-10">
                  {/* <div className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                    <span>⭐</span>
                    <span>+10 Điểm RL</span>
                  </div> */}
                </div>
                {console.log('activity',activity)}
                {activity.poster_url ? (
                  <Image
                    src={activity.poster_url}
                    alt={activity.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-5xl">📋</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {activity.title}
                </h3>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  {activity.start_date && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-xs">
                        {`${formatDate(activity.start_date)} - ${formatDate(activity.end_date)}`}
                      </span>
                    </div>
                  )}
                  {activity.location && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium line-clamp-1 text-xs">{activity.location}</span>
                    </div>
                  )}
                  {activity.participant_count !== undefined && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs font-medium">+{activity.participant_count} Điểm rèn luyện</span>
                    </div>
                  )}
                </div>

                {/* Register Button */}
                <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
