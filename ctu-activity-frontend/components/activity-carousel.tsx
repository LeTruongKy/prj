'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Loader, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import apiClient from '@/lib/api'

interface Category {
  category_id: number
  name: string
  color?: string
}

interface ActivityData {
  activity_id: number
  title: string
  description: string
  category: Category
  location: string
  start_time: string
  end_time: string
  max_participants: number
  status: string
  registration_count: number
  posterUrl?: string | null
}

interface ActivityCarouselProps {
  categoryId?: number
  categoryName: string
  showAll?: boolean
}

// Placeholder image for activities without poster
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export default function ActivityCarousel({
  categoryId,
  categoryName,
  showAll = false
}: ActivityCarouselProps) {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    fetchActivities()
  }, [categoryId])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/activities', {
        params: categoryId ? { categoryId } : {}
      })
      
      let filteredActivities = response.data.data || response.data
      
      // Filter by category if categoryId is provided
      if (categoryId && Array.isArray(filteredActivities)) {
        filteredActivities = filteredActivities.filter(
          (activity: ActivityData) => activity.category?.category_id === categoryId
        )
      }

      // Limit to 6 items if not showing all
      if (!showAll && Array.isArray(filteredActivities)) {
        filteredActivities = filteredActivities.slice(0, 6)
      }

      setActivities(Array.isArray(filteredActivities) ? filteredActivities : [])
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError('Không thể tải hoạt động')
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${categoryId || 'all'}`)
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === 'left'
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount
      container.scrollLeft = newPosition
      setScrollPosition(newPosition)
    }
  }

  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>
        <p className="text-muted-foreground">Không có hoạt động nào</p>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{categoryName}</h2>
          {activities.length > 4 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="h-10 w-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="h-10 w-10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div
          id={`carousel-${categoryId || 'all'}`}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {activities.map((activity) => (
            <Link
              key={activity.activity_id}
              href={`/activities/${activity.activity_id}`}
              className="flex-shrink-0 w-full sm:w-96 snap-start"
            >
              <Card className="h-full border border-border hover:shadow-lg hover:border-primary transition-all duration-300 overflow-hidden group">
                {/* Image Container with 16:9 aspect ratio */}
                <div className="relative w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden aspect-video">
                  {activity.posterUrl ? (
                    <Image
                      src={activity.posterUrl}
                      alt={activity.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => {
                        // Handle image load error by showing placeholder
                      }}
                      priority={false}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm opacity-60">No Image</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-md bg-black/40"
                      style={{}}
                    >
                      {activity.category.name}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                      {activity.status === 'PUBLISHED' ? 'Sắp diễn ra' : 'Khác'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="pt-4 pb-4 px-4">
                  {/* Title */}
                  <h3 className="font-bold text-lg line-clamp-2 text-foreground mb-2 group-hover:text-primary transition-colors">
                    {activity.title}
                  </h3>

                  {/* Date and Time */}
                  <div className="text-sm text-muted-foreground mb-3">
                    <p className="font-medium">
                      📅 {formatDate(activity.start_time)} · {formatTime(activity.start_time)}
                    </p>
                    {activity.end_time && activity.end_time !== activity.start_time && (
                      <p className="text-xs">
                        Kết thúc: {formatDate(activity.end_time)} · {formatTime(activity.end_time)}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="text-sm text-muted-foreground mb-3 line-clamp-1">
                    📍 {activity.location}
                  </div>

                  {/* Registration info */}
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">👥 Đã đăng ký</span>
                      <span className="font-bold text-primary">
                        {activity.registration_count}/{activity.max_participants}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width: `${Math.min((activity.registration_count / activity.max_participants) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((activity.registration_count / activity.max_participants) * 100)}% Full
                    </p>
                  </div>

                  {/* Join Button */}
                  <Button className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Xem Chi Tiết
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
