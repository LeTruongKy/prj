'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, AlertCircle, Loader, ImageIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getActivities, getCategories, Activity } from '@/lib/activity-service'

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Helper to check if activity has ended
function isActivityExpired(endTime: string): boolean {
  return new Date(endTime) < new Date()
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        // Handle nested data structure: response.data.data contains the array
        const categoriesData = data.data || data
        // Ensure it's an array
        const categoriesArray = categoriesData.data
        setCategories(categoriesArray)
      } catch (err) {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  // Fetch activities when filters change
  useEffect(() => {
    fetchActivities(1)
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  // Fetch activities from API
  const fetchActivities = async (page: number = 1) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getActivities(page, 10, {
        search: searchTerm || undefined,
        categoryId: categoryFilter !== 'all' ? parseInt(categoryFilter) : undefined,
        status: 'PUBLISHED',
        expand: 'category,unit',
      })
      console.log('Fetched activities response:', data)
      // Handle nested data structure: response.data contains {data: [...], pagination: {...}}
      const activitiesData = data.data.data || []
      const activitiesArray = Array.isArray(activitiesData) ? activitiesData : []
      setActivities(activitiesArray)
      console.log('Extracted activities array:', activitiesArray)
      setPagination(data.data.pagination || { page, limit: 10, total: 0, totalPages: 0 })
      setCurrentPage(page)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  // Generate pagination page numbers
  const getPaginationPages = () => {
    const pages: (number | string)[] = []
    const total = pagination.totalPages
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(total - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < total - 2) pages.push('...')
      pages.push(total)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Danh sách hoạt động
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-xl">
            Khám phá và đăng ký các hoạt động sinh viên hấp dẫn nhất học kỳ này.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calendar">
              <button className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg">
                📅 Xem lịch cá nhân
              </button>
            </Link>
            <Link href="/profile">
              <button className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white/25 transition-colors border border-white/30">
                ✅ Hoạt động đã tham gia
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 -mt-7 relative z-10 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên hoạt động, đơn vị tổ chức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-10 py-3 bg-gray-50 border-gray-200 rounded-xl text-base h-12"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters - Pill Tabs */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Phân loại</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                categoryFilter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              Tất cả
            </button>

            {categories.map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => setCategoryFilter(cat.category_id.toString())}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  categoryFilter === cat.category_id.toString()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Hiện thị <span className="font-bold text-gray-900">{pagination.total}</span> hoạt động tìm thấy
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-500 font-medium">Đang tải hoạt động...</p>
            </div>
          </div>
        )}

        {/* Activity Grid */}
        {!loading && (
          <>
            {activities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {activities.map((activity) => {
                  const expired = isActivityExpired(activity.end_time)

                  return (
                    <Link
                      key={activity.activity_id}
                      href={`/activities/${activity.activity_id}`}
                    >
                      <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full cursor-pointer overflow-hidden bg-white rounded-2xl">
                        {/* Image Container */}
                        <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                          {/* Category Badge - Top Left */}
                          <div className="absolute top-3 left-3 z-10">
                            <Badge
                              className="text-white text-[11px] font-bold px-3 py-1 uppercase tracking-wide shadow-md"
                              style={{ backgroundColor: activity?.category?.color || '#3b5feb' }}
                            >
                              {activity.category?.name}
                            </Badge>
                          </div>

                          {/* Points Badge - Top Right */}
                          {/* <div className="absolute top-3 right-3 z-10">
                            <div className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                              <span>+5 ĐRL</span>
                            </div>
                          </div> */}

                          {/* Expired Overlay */}
                          {expired && (
                            <div className="absolute inset-0 bg-black/40 z-[5] flex items-center justify-center">
                              <div className="bg-red-500/90 backdrop-blur-sm text-white text-sm font-bold px-5 py-2 rounded-lg shadow-lg border border-red-400/50 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Đã hết hạn
                              </div>
                            </div>
                          )}

                          {activity?.poster_url ? (
                            <Image
                              src={activity.poster_url}
                              alt={activity.title}
                              fill
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              priority={false}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gradient-to-br from-blue-50 to-indigo-100">
                              <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
                              <span className="text-xs text-gray-400">Không có hình ảnh</span>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-5">
                          {/* Title */}
                          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                            {activity.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                            {activity.description}
                          </p>

                          {/* Meta Info */}
                          <div className="space-y-2 mb-5">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                              <span>
                                {new Date(activity.start_time).toLocaleDateString('vi-VN')} - {new Date(activity.end_time).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                              <span className="line-clamp-1">{activity.location || 'Đang cập nhật'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users className="w-4 h-4 text-blue-500 shrink-0" />
                              <span>{activity.registration_count || 0}/{activity.max_participants || '∞'} sinh viên</span>
                            </div>
                          </div>

                          {/* Register Button */}
                          {expired ? (
                            <button className="w-full bg-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl cursor-not-allowed text-sm border border-gray-200">
                              Đã hết hạn
                            </button>
                          ) : (
                            <button
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-md transition-all text-sm shadow-sm"
                            >
                              Đăng ký
                            </button>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📭</span>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy hoạt động</p>
                <p className="text-sm text-gray-500 mb-6">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setCategoryFilter('all')
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg rounded-full px-8 transition-all shadow-md"
                >
                  Xem tất cả hoạt động
                </Button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mb-16">
                {/* Xem thêm hoạt động */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => fetchActivities(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1 || loading}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getPaginationPages().map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                          ···
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => fetchActivities(page as number)}
                          disabled={loading}
                          className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        fetchActivities(Math.min(pagination.totalPages, currentPage + 1))
                      }
                      disabled={currentPage === pagination.totalPages || loading}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
