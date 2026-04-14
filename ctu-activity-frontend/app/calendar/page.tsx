'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/auth-store'
import {
  getUserCalendar,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatCalendarDate,
  formatCalendarTime,
  CalendarDay,
  CalendarEvent,
} from '@/lib/services/calendar-service'
import { toast } from '@/hooks/use-toast'
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, BarChart2, CalendarCheck } from 'lucide-react'
import LoadingSkeleton from '@/components/common/loading-skeleton'

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

// Map JS getDay() (0=Sun..6=Sat) → Mon-first index (0=Mon..6=Sun)
function toMonFirstIndex(jsDay: number) {
  return (jsDay + 6) % 7
}

export default function CalendarPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [calendarData, setCalendarData] = useState<any>(null)
  const [allMergedEvents, setAllMergedEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    // Default selected day = today if viewing current month, else 1st
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1
    setSelectedDay(
      isCurrentMonth
        ? todayStr
        : `${year}-${String(month).padStart(2, '0')}-01`
    )
    loadCalendar()
  }, [isAuthenticated, year, month])

  // Helper to get previous month(s) year/month pairs
  const getPrevMonth = (y: number, m: number, offset: number = 1): { year: number; month: number } => {
    let totalMonths = y * 12 + (m - 1) - offset
    return { year: Math.floor(totalMonths / 12), month: (totalMonths % 12) + 1 }
  }

  const loadCalendar = async () => {
    try {
      setIsLoading(true)

      // Fetch current month + up to 3 previous months to catch multi-month spanning events
      const monthsToFetch = [
        { year, month },
        getPrevMonth(year, month, 1),
        getPrevMonth(year, month, 2),
        getPrevMonth(year, month, 3),
      ]

      const results = await Promise.allSettled(
        monthsToFetch.map(m => getUserCalendar(m.year, m.month))
      )
      console.log('Fetched calendar data for multiple months:', results)

      // Current month data (always first)
      const currentMonthResult = results[0]
      const currentData = currentMonthResult.status === 'fulfilled' ? currentMonthResult.value : null
      if (currentData) {
        setCalendarData(currentData)
      }

      // Merge all unique events from all fetched months
      const seenIds = new Set<string>()
      const merged: CalendarEvent[] = []
      for (const result of results) {
        if (result.status !== 'fulfilled' || !result.value?.days) continue
        for (const day of result.value.days) {
          for (const ev of day.events) {
            const key = ev.id || ev.activityId?.toString()
            if (key && !seenIds.has(key)) {
              seenIds.add(key)
              merged.push(ev)
            }
          }
        }
      }
      setAllMergedEvents(merged)
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể tải lịch', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1) }
    else setMonth(month - 1)
  }

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1) }
    else setMonth(month + 1)
  }

  const handleToday = () => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
    setSelectedDay(todayStr)
  }

  // if (isLoading) return <LoadingSkeleton />

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayJS = new Date(year, month - 1, 1).getDay()
  const firstDayMonFirst = toMonFirstIndex(firstDayJS)

  const monthLabel = new Date(year, month - 1).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
  const monthTitle = `Tháng ${month}, ${year}`

  // Build grid: prefix empty cells then 1..daysInMonth
  const calendarCells: (number | null)[] = []
  for (let i = 0; i < firstDayMonFirst; i++) calendarCells.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i)

  // ── Expand multi-day events across all dates from startTime to endTime ──
  // Uses allMergedEvents which includes events from adjacent months
  const expandedDayMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    if (allMergedEvents.length === 0) return map

    // For each event, add it to every date between startTime and endTime
    for (const ev of allMergedEvents) {
      const start = new Date(ev.startTime)
      const end = new Date(ev.endTime)
      // Normalize to date-only (strip time, use local date)
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())

      const cursor = new Date(startDate)
      while (cursor <= endDate) {
        const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
        if (!map[dateStr]) map[dateStr] = []
        // Avoid duplicates
        if (!map[dateStr].some(e => (e.id || e.activityId) === (ev.id || ev.activityId))) {
          map[dateStr].push(ev)
        }
        cursor.setDate(cursor.getDate() + 1)
      }
    }

    return map
  }, [allMergedEvents])

  // Data for selected day (using expanded map)
  const selectedDayEvents: CalendarEvent[] = selectedDay ? (expandedDayMap[selectedDay] || []) : []
  const selectedIsToday = selectedDay === todayStr

  // Summary for selected day
  const selectedDayEventCount = selectedDayEvents.length

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const events = expandedDayMap[dateStr] || []
    const originalDay = calendarData?.days?.find((d: any) => d.date === dateStr) as CalendarDay | undefined
    return {
      date: dateStr,
      hasEvents: events.length > 0,
      events,
      hasConflicts: originalDay?.hasConflicts || false,
    } as CalendarDay
  }

  const getEventColor = (idx: number) => {
    const colors = [
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
    ]
    return colors[idx % colors.length]
  }

  const getStatusBadge = (event: CalendarEvent) => {
    // Heuristic: if event has a criteriaGroupId = verified; else pending
    if (event.criteriaGroupId) {
      return { label: 'VERIFIED', cls: 'bg-green-100 text-green-700' }
    }
    return { label: 'REGISTERED', cls: 'bg-blue-100 text-blue-700' }
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900">Lịch hoạt động</h1>
          <p className="text-gray-500 mt-1">Theo dõi và quản lý hoạt động của bạn</p>
        </div>

        {/* Main Layout: Calendar + Right Panel */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Calendar ── */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Calendar Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold text-blue-600 text-base tracking-wide">{monthTitle}</span>

              <button
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <Button
                onClick={handleToday}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 rounded-xl"
                size="sm"
              >
                Hôm nay
              </Button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-3 text-center text-xs font-bold text-gray-400 tracking-widest">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarCells.map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[100px] border-b border-r border-gray-50 bg-gray-50/40"
                    />
                  )
                }

                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayData = getDayData(day)
                const hasEvents = dayData.hasEvents
                const hasConflicts = dayData.hasConflicts
                const isToday = dateStr === todayStr
                const isSelected = dateStr === selectedDay
                const events = dayData.events

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDay(dateStr)}
                    className={`min-h-[100px] border-b border-r border-gray-100 p-2 flex flex-col gap-1 text-left transition-all
                      ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : 'hover:bg-gray-50'}
                      ${hasConflicts && !isSelected ? 'ring-1 ring-inset ring-red-300' : ''}
                    `}
                  >
                    {/* Day Number */}
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-all
                        ${isToday ? 'bg-blue-600 text-white' : isSelected ? 'text-blue-700' : 'text-gray-700'}
                      `}
                    >
                      {day}
                    </span>

                    {/* Conflict indicator */}
                    {hasConflicts && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                        ▲ Xung đột
                      </span>
                    )}

                    {/* Event pills (max 2 visible + count) */}
                    {events.slice(0, 2).map((ev: CalendarEvent, i: number) => (
                      <span
                        key={ev.id || i}
                        className={`text-[10px] truncate font-medium px-1.5 py-0.5 rounded ${getEventColor(i)}`}
                      >
                        {ev.title}
                      </span>
                    ))}
                    {events.length > 2 && (
                      <span className="text-[10px] text-gray-500 font-medium">
                        +{events.length - 2} more
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 px-6 py-4 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Đã xác nhận (Verified)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-400 inline-block"></span> Đang chờ (Pending)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Xung đột (Conflict)
              </span>
            </div>
          </div>

          {/* ── RIGHT: Day Detail Panel ── */}
          <div className="w-72 shrink-0 flex flex-col gap-4">
            {/* Selected Day Header */}
            {selectedDay && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    {(() => {
                      const d = new Date(selectedDay + 'T00:00:00')
                      return (
                        <>
                          <p className="text-3xl font-bold text-gray-900">
                            Thứ {d.getDay() === 0 ? 'CN' : d.getDay() + 1},{' '}
                            {String(d.getDate()).padStart(2, '0')}/{String(d.getMonth() + 1).padStart(2, '0')}
                          </p>
                          {selectedIsToday && (
                            <p className="text-blue-600 text-sm font-medium mt-0.5">Hôm nay</p>
                          )}
                        </>
                      )
                    })()}
                  </div>
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Events for selected day */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">
                  {selectedDayEvents.length > 0
                    ? `${selectedDayEvents.length} sự kiện hôm nay`
                    : 'Sự kiện trong ngày'}
                </h3>
              </div>

              {selectedDayEvents.length > 0 ? (
                <div className="p-3 space-y-3 max-h-72 overflow-y-auto">
                  {selectedDayEvents.map((event, idx) => {
                    const badge = getStatusBadge(event)
                    const activityLink = `/activities/${event.activityId || event.id}`
                    return (
                      <Link
                        href={activityLink}
                        key={event.id || idx}
                        className="block rounded-xl border border-gray-100 p-4 bg-gray-50/60 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-3 group-hover:text-blue-700 transition-colors">
                            {event.title}
                          </h4>
                          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <span className="text-gray-400">🕐</span>
                            {formatCalendarDate(event.startTime)} – {formatCalendarDate(event.endTime)}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <span className="text-gray-400">⏰</span>
                            {formatCalendarTime(event.startTime)} – {formatCalendarTime(event.endTime)}
                          </p>
                          {event.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                              <span className="text-gray-400">📍</span>
                              {event.location}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-gray-400 text-sm">Không có sự kiện trong ngày này</p>
                </div>
              )}
            </div>

            {/* Today Summary Card */}
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold tracking-wide uppercase">Tóm tắt ngày</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-3xl font-extrabold">{selectedDayEventCount > 0 ? selectedDayEventCount.toString().padStart(2, '0') : '00'}</p>
                  <p className="text-blue-200 text-xs mt-0.5">Hoạt động</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold">
                    {calendarData?.totalConflicts === 0 ? 'Tốt' : 'Xung đột'}
                  </p>
                  <p className="text-blue-200 text-xs mt-0.5">Trạng thái</p>
                </div>
              </div>
            </div>

            {/* View full day button */}
            <button className="w-full bg-white border-2 border-blue-500 text-blue-600 font-semibold text-sm rounded-2xl py-3 hover:bg-blue-50 transition">
              Chi tiết toàn bộ ngày
            </button>

            {/* Conflict list (if any) */}
            {calendarData?.totalConflicts > 0 && (
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-red-50 flex items-center gap-2">
                  <span className="text-red-500 text-sm">▲</span>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {calendarData.totalConflicts} Xung đột
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  {calendarData.days
                    ?.filter((d: any) => d.hasConflicts)
                    .slice(0, 5)
                    .map((day: any) => (
                      <button
                        key={day.date}
                        onClick={() => setSelectedDay(day.date)}
                        className="w-full text-left p-3 rounded-xl bg-red-50 hover:bg-red-100 transition"
                      >
                        <p className="text-sm font-semibold text-gray-900">{formatCalendarDate(day.date)}</p>
                        <p className="text-xs text-red-600 mt-0.5">{day.events?.length || 0} sự kiện</p>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
