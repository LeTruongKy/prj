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
  image?: string | null
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

const categoryColorMap: Record<string, { badge: string; dot: string }> = {
  TÌNH_NGUYỆN: { badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-500' },
  HỌC_THUẬT: { badge: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white', dot: 'bg-gradient-to-r from-blue-600 to-purple-600' },
  THỂ_THAO: { badge: 'bg-orange-500 text-white', dot: 'bg-orange-500' },
  VĂN_NGHỆ: { badge: 'bg-purple-500 text-white', dot: 'bg-purple-500' },
  KỸ_NĂNG: { badge: 'bg-pink-500 text-white', dot: 'bg-pink-500' },
}

const getCategoryStyle = (name?: string) => {
  if (!name) return { badge: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white', dot: 'bg-gradient-to-r from-blue-600 to-purple-600' }
  const upper = name.toUpperCase().replace(/\s+/g, '_')
  for (const [key, value] of Object.entries(categoryColorMap)) {
    if (upper.includes(key.replace('_', ''))) return value
  }
  return { badge: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white', dot: 'bg-gradient-to-r from-blue-600 to-purple-600' }
}

export default function FeaturedActivities({ activities }: FeaturedActivitiesProps) {
      {console.log('Rendering FeaturedActivities with activities:', activities)}

  return (
    <section id="activities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Sắp diễn ra
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Hoạt động sắp tới
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Đừng bỏ lỡ các sự kiện quan trọng trong tuần này
          </p>
        </div>
        <Link
          href="/activities"
          className="self-start sm:self-auto inline-flex items-center gap-2 text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-lg shadow-md shrink-0"
        >
          Xem tất cả
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      {activities.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-500 text-lg font-medium">Hiện không có hoạt động nào</p>
          <p className="text-gray-400 text-sm mt-1">Vui lòng quay lại sau</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.slice(0, 6).map((activity) => {
            const style = getCategoryStyle(activity.category_name)
            const posterUrl = activity.poster_url || activity.image
            return (
              <Link key={activity.id} href={`/activities/${activity.id}`} className="block group">
                <div className="h-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-400 border border-gray-100 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    {activity.category_name && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`${style.badge} text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm`}>
                          {activity.category_name}
                        </span>
                      </div>
                    )}
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={activity.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center gap-2">
                        <span className="text-5xl">📋</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Title */}
                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4 text-sm text-gray-500 flex-1">
                      {activity.start_date && (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="font-medium text-xs text-gray-600">
                            {formatDate(activity.start_date)}
                            {activity.end_date && activity.end_date !== activity.start_date
                              ? ` — ${formatDate(activity.end_date)}`
                              : ''}
                          </span>
                        </div>
                      )}
                      {activity.location && (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="font-medium line-clamp-1 text-xs text-gray-600">{activity.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Register Button */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2.5 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-md hover:shadow-purple-300 active:scale-95">
                      Đăng ký ngay
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
