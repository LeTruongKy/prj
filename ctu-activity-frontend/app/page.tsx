'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
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

    console.log('Home component hydrated. Authenticated:', isAuthenticated, 'User:', user)
    
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
      const response = await getActivities(1, 3, {
        status: 'PUBLISHED',
        expand: 'category,unit'
      })

      // Extract from nested structure: response.data.data contains the array
      const activitiesData = response.data?.data || []
      const activityList = Array.isArray(activitiesData) ? activitiesData : []

      // Map to ActivityData format
      const mapped = activityList.map((activity: Activity) => ({
        id: activity.activity_id,
        title: activity.title,
        description: activity.description,
        category_id: activity.category?.category_id,
        category_name: activity.category?.name,
        location: activity.location || 'Chưa xác định',
        start_date: activity.start_time,
        end_date: activity.end_time,
        image: activity.posterUrl || null,
        participant_count: activity.registration_count || 0,
        status: activity.status
      }))

      setHeroActivities(mapped.slice(0, 6))
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
      console.log('Fetched categories response:', response)

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
      if (!user?.user_id) {
        console.warn('User ID not available')
        setStudentProgress(null)
        return
      }

      const response = await apiClient.get(`/users/${user?.user_id}/sv5t/progress`)
      console.log('Fetched student progress response:', response)

      // Extract from nested structure: response.data.data.data contains the SV5TProgressData
      const progressData = response.data?.data?.data || response.data?.data || null

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
      console.log('Fetching recommendations for user:', user)
      if (!user?.user_id) {
        console.warn('User ID not available for recommendations')
        setRecommendations([])
        return
      }

      console.log('[Homepage Recs] Fetching recommendations for user:', user?.user_id)
      const response = await privateAxios.get(
        `/activities/recommendations/${user?.user_id}?limit=10`
      )
      console.log('[Homepage Recs] Recommendations fetched:', response)

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
      <div className="bg-white">
        <LandingHero />
        <StatsSection />
        <FeaturesSection />
        <ProcessSection />
        <CTASection />
      </div>
    )
  }

  // ============ LOGGED IN - Show Personalized Home ============
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Dashboard Hero Section */}
      <DashboardHero />

      {/* Featured Activities Section */}
      {console.log(heroActivities)}
      {loadingHero ? (
        <div className="py-20 flex items-center justify-center">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : heroActivities.length > 0 ? (
        <FeaturedActivities activities={heroActivities} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500">
          <p>Hiện không có hoạt động nào. Vui lòng quay lại sau.</p>
        </div>
      )}

      {/* Progress Section */}
      <ProgressSection studentProgress={studentProgress} />

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <RecommendationsSection recommendations={recommendations} />
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <CategoriesSection categories={categories} />
      )}
    </div>
  )
}
