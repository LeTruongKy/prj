'use client'

import { Activity } from '@/lib/activity-service'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Building2, Loader, AlertCircle } from 'lucide-react'

interface RegisterConfirmationModalProps {
  activity: Activity
  isOpen: boolean
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading: boolean
  error?: string | null
}

function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Đang cập nhật...'
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    return 'Đang cập nhật...'
  }
}

export function RegisterConfirmationModal({
  activity,
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  error,
}: RegisterConfirmationModalProps) {
  const isFull =
    activity.max_participants > 0 &&
    activity.registration_count >= activity.max_participants

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Xác nhận đăng ký
          </DialogTitle>
          <DialogDescription>
            Vui lòng kiểm tra thông tin hoạt động trước khi đăng ký tham gia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Activity Title */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {activity.title}
            </h3>
            {activity.category && (
              <span
                className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: activity.category.color || '#3b5feb' }}
              >
                {activity.category.name}
              </span>
            )}
          </div>

          {/* Activity Details Grid */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Thời gian</p>
                <p className="text-gray-800 font-semibold">
                  {formatDateTime(activity.start_time)} — {formatDateTime(activity.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Địa điểm</p>
                <p className="text-gray-800 font-semibold">{activity.location || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Đơn vị tổ chức</p>
                <p className="text-gray-800 font-semibold">{activity.unit?.name || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Số lượng</p>
                <p className="text-gray-800 font-semibold">
                  {activity.registration_count || 0} / {activity.max_participants || '∞'} người đã đăng ký
                </p>
              </div>
            </div>
          </div>

          {/* Full capacity warning */}
          {isFull && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>Hoạt động đã đủ số lượng tham gia. Bạn có thể không đăng ký được.</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || isFull}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Đang đăng ký...
              </span>
            ) : (
              'Xác nhận đăng ký'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
