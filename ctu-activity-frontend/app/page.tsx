'use client'

import { useEffect, useState } from 'react'
import { Loader, Router } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { getActivities, getCategories, Activity, Category } from '@/lib/activity-service'
import apiClient from '@/lib/api'
import privateAxios from '@/lib/axios/privateAxios'
import LandingHero from '@/components/landing/landing-hero'
import StatsSection from '@/components/landing/stats-section'
import FeaturesSection from '@/components/landing/features-section'
import ProcessSection from '@/components/landing/process-section'
import CTASection from '@/components/landing/cta-section'
import DashboardHero from '@/components/dashboard/dashboard-hero'
import FeaturedActivities from '@/components/dashboard/featured-activities'
import ProgressSection from '@/components/dashboard/progress-section'
import CategoriesSection from '@/components/dashboard/categories-section'
import RecommendationsSection from '@/components/dashboard/recommendations-section'
import StatisticsSection from '@/components/dashboard/statistics-section'
import OrganizationSection from '@/components/dashboard/organization-section'
import TestimonialsSection from '@/components/dashboard/testimonials-section'
import AboutSection from '@/components/dashboard/about-section'

interface ActivityData {
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

interface RecommendedActivity {
  id: number
  title: string
  description?: string
  category: { category_id: number; name: string; color: string }
  unit: { unit_id: number; name: string }
  location?: string
  posterUrl?: string
  startTime: string
  endTime: string
  maxParticipants?: number
  registrationCount?: number
  status: string
  creator?: { id: string; fullName: string }
  similarity_score: number
  ai_matched_tags: Array<{ id: number; name: string }>
}

export default function Home() {
  const { isAuthenticated, isHydrated, user } = useAuthStore()
  const [heroActivities, setHeroActivities] = useState<ActivityData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recommendations, setRecommendations] = useState<RecommendedActivity[]>([])
  const [studentProgress, setStudentProgress] = useState<SV5TProgressData | null>(null)
  const [loadingHero, setLoadingHero] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  useEffect(() => {
    if (!isHydrated) return

    
    if (isAuthenticated) {
      fetchHeroActivities()
      fetchCategories()
      fetchStudentProgressData()
      fetchRecommendations()
    }
  }, [isAuthenticated, isHydrated])

  const fetchHeroActivities = async () => {
    try {
      setLoadingHero(true)
      // Match API call from activities/page.tsx
      const response = await getActivities(1, 100, {
        status: 'PUBLISHED',
        expand: 'category,unit'
      })
      // Extract from nested structure: response.data.data contains the array
      const activitiesData = response.data?.data || []
      const activityList = Array.isArray(activitiesData) ? activitiesData : []
      // Filter activities with future start time and sort by nearest start time
      const now = new Date()
      const futureActivities = activityList
        .filter((activity: Activity) => {
          const startTime = new Date(activity.start_time)
          return startTime > now
        })
        .sort((a: Activity, b: Activity) => {
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        })
        .slice(0, 3) // Take only 3 nearest upcoming activities
      // Map to ActivityData format
      const mapped = futureActivities.map((activity: Activity) => ({
        id: activity.activity_id,
        title: activity.title,
        description: activity.description,
        category_id: activity.category?.category_id,
        category_name: activity.category?.name,
        location: activity.location || 'Chưa xác định',
        start_date: activity.start_time,
        end_date: activity.end_time,
        image: activity.posterUrl || null,
        poster_url: activity.poster_url || null,
        participant_count: activity.registration_count || 0,
        status: activity.status,
        criteria: activity.criteria || []
      }))
      setHeroActivities(mapped)
    } catch (error) {
      console.error('Error fetching hero activities:', error)
      setHeroActivities([])
    } finally {
      setLoadingHero(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getCategories()

      // Extract from nested structure: response.data contains array of categories
      const categoryList = response.data?.data || response.data || []
      const categoriesArray = Array.isArray(categoryList) ? categoryList : []

      setCategories(categoriesArray)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback categories
      setCategories([
        { category_id: 1, name: 'Tình nguyện', color: '#10b981' },
        { category_id: 2, name: 'Học thuật', color: '#3b82f6' },
        { category_id: 3, name: 'Hội nhập & Kỹ năng', color: '#f59e0b' },
        { category_id: 4, name: 'Thể thao', color: '#ef4444' },
        { category_id: 5, name: 'Văn nghệ', color: '#8b5cf6' },
      ])
    }
  }

  const fetchStudentProgressData = async () => {
    try {
      setLoadingProgress(true)
      // Match API call from progress/page.tsx
      if (!user?.user?.user_id) {
        console.warn('User ID not available')
        setStudentProgress(null)
        return
      }

      const response = await apiClient.get(`/users/${user?.user?.user_id}/sv5t/progress`)

      // Extract from nested structure: response.data.data contains the SV5TProgressData
      const progressData = response.data?.data.data || null

      if (progressData) {
        setStudentProgress(progressData)
      } else {
        setStudentProgress(null)
      }
    } catch (error) {
      console.error('Error fetching student progress:', error)
      setStudentProgress(null)
    } finally {
      setLoadingProgress(false)
    }
  }

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      // Match API call from ai-recommendations/page.tsx
      if (!user?.user_id) {
        console.warn('User ID not available for recommendations')
        setRecommendations([])
        return
      }

      const response = await privateAxios.get(
        `/activities/recommendations/${user?.user_id}?limit=10`
      )

      // Extract from nested structure: response.data.data.recommendations
      const recs = response.data?.data?.recommendations || []
      setRecommendations(Array.isArray(recs) ? recs : [])
    } catch (error) {
      console.error('[Homepage Recs] Error fetching recommendations:', error)
      setRecommendations([])
    } finally {
      setLoadingRecommendations(false)
    }
  }

  // ============ NOT LOGGED IN - Show Welcome Page ============
  if (isHydrated && !isAuthenticated) {
    return (
      <div className="bg-white overflow-x-hidden">
      <DashboardHero />
        <StatsSection />
        <FeaturesSection />
        <ProcessSection />
        <CTASection />
      </div>
    )
  }

  // ============ LOADING - Waiting for hydration ============
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  // ============ LOGGED IN - Show Personalized Home ============
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* HERO */}
      <DashboardHero />

      {/* FEATURED ACTIVITIES */}
      <div className="bg-white">
        {loadingHero ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <FeaturedActivities activities={heroActivities} />
        )}
      </div>

      {/* PROGRESS */}
      {loadingProgress ? (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      ) : (
        <ProgressSection studentProgress={studentProgress} />
      )}

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <div className="bg-white">
          <CategoriesSection categories={categories} />
        </div>
      )}

      {/* STATISTICS */}
      {/* <StatisticsSection /> */}

      {/* ABOUT */}
      {/* <AboutSection /> */}

      {/* ORGANIZATION / BCH */}
      <OrganizationSection />

      {/* TESTIMONIALS */}
      {/* <TestimonialsSection /> */}

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="bg-white">
          {loadingRecommendations ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <RecommendationsSection recommendations={recommendations} />
          )}
        </div>
      )}

      {/* CTA */}
      {/* <div className="bg-white">
        <CTASection />
      </div> */}

    </div>
  )
}
