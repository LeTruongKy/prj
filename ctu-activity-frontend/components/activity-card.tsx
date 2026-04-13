'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'

interface ActivityCardProps {
  id: string
  title: string
  category: 'Academic' | 'Volunteer' | 'Sports'
  organizer: string
  startDate: string
  endDate: string
  location: string
  enrolled: number
  capacity: number
  posterUrl?: string | null
}

// Placeholder SVG image for missing posters
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"

const categoryStyles = {
  Academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  Volunteer: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  Sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
}

export default function ActivityCard({
  id,
  title,
  category,
  organizer,
  startDate,
  endDate,
  location,
  enrolled,
  capacity,
  posterUrl,
}: ActivityCardProps) {
  const enrollmentPercentage = (enrolled / capacity) * 100
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/activities/${id}`}>
      <div className="h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer flex flex-col">
        {/* Poster Image with 16:9 aspect ratio and hover zoom effect */}
        <div className="relative w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden aspect-video group rounded-t-xl">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
              onError={() => setImageError(true)}
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm opacity-60">No Image</span>
            </div>
          )}
          
          {/* Category Badge - Absolute positioning on top-left */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 drop-shadow-md ${
                categoryStyles[category]
              }`}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Card Header with Gradient Accent */}
        <div className="h-2 bg-gradient-to-r from-primary to-primary/70"></div>

        {/* Card Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Organizer */}
          <p className="text-sm text-muted-foreground mb-4">{organizer}</p>

          {/* Date and Location Section */}
          <div className="space-y-2 mb-4 flex-1">
            {/* Start & End Time */}
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-foreground font-medium">{startDate}</span>
                {endDate !== startDate && (
                  <span className="text-muted-foreground text-xs">to {endDate}</span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground line-clamp-1">{location}</span>
            </div>
          </div>

          {/* Enrollment Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {enrolled}/{capacity} enrolled
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(enrollmentPercentage)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* View Details Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-9"
            asChild
          >
            <span>View Details</span>
          </Button>
        </div>
      </div>
    </Link>
  )
}
