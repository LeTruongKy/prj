'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
    console.log('recomend321',recommendations)
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
                  {rec.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {rec.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2.5 mb-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⏰</span>
                      <span className="font-medium">{formatDateTime(rec.start_time)} - </span>
                      <span className="font-medium">{formatDateTime(rec.end_time)}</span>
                    </div>
                    {rec.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-base">📍</span>
                        <span className="font-medium line-clamp-1">{rec.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Register Button */}
                  <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <span>Xem Chi Tiết</span>
                    <ArrowRight className="w-4 h-4" />
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
