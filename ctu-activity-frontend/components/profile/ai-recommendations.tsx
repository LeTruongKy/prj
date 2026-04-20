'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Criterion {
  criterion_id: number
  name: string
  description?: string
}

interface RecommendedActivity {
  id: number
  title: string
  description?: string
  category: { category_id: number; name: string; color: string }
  location?: string
  posterUrl?: string
  startTime: string
  endTime: string
  status: string
  criteria?: Criterion[]
}

interface AiRecommendationsProps {
  recommendations: RecommendedActivity[]
}

export default function AiRecommendations({ recommendations }: AiRecommendationsProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('vi-VN')
    const timeStr = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
    return `${dateStr} • ${timeStr}`
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Được Gợi Ý Cho Bạn</h2>

      {recommendations.length === 0 ? (
        <Card className="border-0 shadow-lg p-8 text-center">
          <p className="text-muted-foreground">Hiện không có gợi ý nào.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <Link
              key={rec.activity_id}
              href={`/activities/${rec.activity_id}`}
            >
              <Card className="border-gray-200 hover:shadow-xl transition-all h-full cursor-pointer overflow-hidden bg-white">
                {/* Image Container */}
                <div className="relative w-full aspect-video bg-linear-to-br from-slate-200 to-slate-300 overflow-hidden group">
                  {/* Category Badge - Top Left */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      className="text-white text-xs font-bold px-3 py-1 uppercase"
                      style={{ backgroundColor: rec?.category?.color }}
                    >
                      {rec?.category?.name || 'Không có danh mục'}
                    </Badge>
                  </div>

                  {rec?.poster_url ? (
                    <img
                      src={rec.poster_url}
                      alt={rec.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {rec.title}
                  </h3>

                  {/* Description */}
                  {/* {rec.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {rec.description}
                    </p>
                  )} */}

                  {/* Meta Info */}
                  <div className="space-y-2.5 mb-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                      <span className="font-medium">{formatDateTime(rec.start_time)} - </span>
                      <span className="font-medium">{formatDateTime(rec.end_time)}</span>
                    </div>
                    {rec.location && (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        <span className="font-medium line-clamp-1">{rec.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Criteria Badges */}
                  {rec.criteria && rec.criteria.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {rec.criteria.slice(0, 2).map((criterion) => (
                          <span
                            key={criterion.criterion_id}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 truncate"
                          >
                            {criterion.name}
                          </span>
                        ))}
                        {rec.criteria.length > 2 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                            +{rec.criteria.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Register Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-md transition-all text-sm shadow-sm">
                    <span>Đăng ký ngay</span>
                  </button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
