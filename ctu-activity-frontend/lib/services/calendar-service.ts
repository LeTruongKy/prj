import { apiClient } from '@/lib/api'

export interface CalendarEvent {
  id: string
  activityId: number
  title: string
  description?: string
  location?: string
  startTime: string
  endTime: string
  criteriaGroupId?: string
  maxParticipants?: number
}

export interface CalendarDay {
  date: string // YYYY-MM-DD
  hasEvents: boolean
  events: CalendarEvent[]
  hasConflicts: boolean
}

export interface CalendarMonth {
  year: number
  month: number
  days: CalendarDay[]
  totalEvents: number
  totalConflicts: number
}

/**
 * Get calendar events with conflicts for user
 */
export async function getUserCalendar(year: number, month: number): Promise<CalendarMonth> {
  try {
    const response = await apiClient.get(`/calendar`, {
      params: {
        year,
        month,
      },
    })
    
    // Backend now returns structured CalendarMonth directly
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch user calendar:', error)
    throw error
  }
}

/**
 * Get calendar with conflict detection
 */
export async function getCalendarWithConflicts(year: number, month: number): Promise<{
  events: CalendarEvent[]
  conflictsByDate: Record<string, CalendarEvent[]>
  totalConflicts: number
}> {
  try {
    const calendarMonth = await getUserCalendar(year, month)
    
    // Transform CalendarMonth to conflict detection format
    const events: CalendarEvent[] = []
    const conflictsByDate: Record<string, CalendarEvent[]> = {}
    let totalConflicts = 0
    
    calendarMonth.days.forEach((day) => {
      if (day.events.length > 0) {
        conflictsByDate[day.date] = day.events
        day.events.forEach((event) => {
          events.push(event)
        })
        
        if (day.hasConflicts) {
          totalConflicts += day.events.length
        }
      }
    })
    
    return {
      events,
      conflictsByDate,
      totalConflicts,
    }
  } catch (error) {
    console.error('Failed to fetch calendar with conflicts:', error)
    throw error
  }
}

/**
 * Format date for calendar display
 */
export function formatCalendarDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format time for calendar display
 */
export function formatCalendarTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get days in month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Get first day of month (0 = Sunday, 1 = Monday, etc.)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

/**
 * Check if date has conflicts
 */
export function hasConflictOnDate(date: string, conflictsByDate: Record<string, CalendarEvent[]>): boolean {
  return (conflictsByDate[date]?.length || 0) > 0
}

/**
 * Get events for date
 */
export function getEventsForDate(date: string, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((event) => {
    const eventDate = new Date(event.startTime).toISOString().split('T')[0]
    return eventDate === date
  })
}
