'use client'

import { useState, useEffect } from 'react'
import { Loader, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import privateAxios from '@/lib/axios/privateAxios'
import AiRecommendations from '@/components/profile/ai-recommendations'
import { useAuthStore } from '@/lib/auth-store'

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

interface AIRecommendationResponse {
  user_id: string
  total_count: number
  recommendations: RecommendedActivity[]
}

export default function AiRecommendationsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [recommendations, setRecommendations] = useState<RecommendedActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('[AI Recs] Component mounted. Checking authentication...', isAuthenticated , user)
    if (isAuthenticated) {
      fetchRecommendations()
    } else {
      setLoading(false)
      setError('Please log in to see personalized recommendations')
    }
  }, [isAuthenticated])

  const fetchRecommendations = async () => {
    // if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      console.log('[AI Recs] Fetching recommendations for user:', user.id)
      const response: AIRecommendationResponse = await privateAxios.get(
        `/activities/recommendations/${user.id}?limit=10`
      )
      setRecommendations(response.data.data.recommendations || [])
    } catch (err: any) {
      console.error('[AI Recs] Error fetching recommendations:', err.message)
      setError('Failed to load recommendations. Please try again.')
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải gợi ý cá nhân hóa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Gợi Ý Của AI</h1>
          <p className="text-lg text-muted-foreground">
            Danh sách hoạt động được gợi ý dựa trên sở thích và hồ sơ của bạn
          </p>
        </div>

        {recommendations.length === 0 ? (
          <Card className="border-0 shadow-lg p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Hiện không có gợi ý. Hãy hoàn thành hồ sơ để nhận được gợi ý cá nhân hóa.
            </p>
          </Card>
        ) : (
          <AiRecommendations recommendations={recommendations} />
        )}
      </div>
    </div>
  )
}
