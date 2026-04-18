'use client'

import Link from 'next/link'
import Image from 'next/image'

interface RecommendationItem {
  id: number | string
  title: string
  description?: string
  category?: { name: string }
  category_name?: string
  image?: string | null
  poster_url?: string | null
  posterUrl?: string | null
  location?: string
  startTime?: string
}

interface RecommendationsSectionProps {
  recommendations: RecommendationItem[]
}

export default function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Gợi ý cho bạn
      </h2>

      {/* Horizontal Scrollable Container */}
      <div className="overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
        <div className="flex gap-5 min-w-max">
          {recommendations.map((item) => {
            console.log(item)
            // Support both image and posterUrl fields
            const imageUrl = (item.poster_url || item.posterUrl) as string | null
            const categoryName = item.category?.name || item.category_name

            return (
              <Link key={item.id} href={`/activities/${item.id}`}>
                <div className="w-64 shrink-0 cursor-pointer group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Image Container */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {/* Category Badge */}
                    {categoryName && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block">
                          {categoryName}
                        </span>
                      </div>
                    )}

                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-5xl">📋</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
