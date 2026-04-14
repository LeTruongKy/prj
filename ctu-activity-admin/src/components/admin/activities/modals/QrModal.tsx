'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Download } from 'lucide-react'
import { toast } from 'sonner'

interface QrModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCodeUrl?: string | null
  activityTitle: string
}

/**
 * QR Code Modal Component for Admin Dashboard
 * 
 * EXPLANATION:
 * ============
 * 
 * WHY URL IS NOT QR CODE:
 * - Backend generates: https://abc.ngrok.app/checkin?activityId=1&...
 * - This is a TEXT URL, not an image
 * - Student phone camera cannot scan text URLs
 * - We need to convert URL → QR image for scanning
 * 
 * WHY FRONTEND RENDERS QR:
 * - QR encoding requires client-side computation
 * - react-qr-code library handles: URL → QR algorithm → SVG image
 * - Backend only provides URL data
 * - Frontend responsible for: validation, rendering, display
 * - This keeps backend simple and lightweight
 * 
 * FLOW:
 * 1. Backend: generates qrCodeUrl (text)
 * 2. Admin: clicks "Hiển thị QR Code" button
 * 3. Frontend Dialog opens with qrCodeUrl
 * 4. react-qr-code: converts URL → QR image
 * 5. Admin: shows QR to students
 * 6. Student: scans with phone camera → opens checkin page
 */
export function QrModal({
  open,
  onOpenChange,
  qrCodeUrl,
  activityTitle,
}: QrModalProps) {
  const [copied, setCopied] = useState(false)

  if (!qrCodeUrl) {
    return null
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl)
      setCopied(true)
      toast.success('Sao chép URL thành công')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Không thể sao chép URL')
    }
  }

  const handleDownloadQr = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      toast.error('Không thể tải QR code')
      return
    }

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `QR_${activityTitle.replace(/\s+/g, '_')}_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Tải QR code thành công')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Điểm Danh</DialogTitle>
          <DialogDescription>
            Sinh viên quét mã QR này để verify tham gia hoạt động
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Activity Title */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Hoạt động</p>
            <p className="text-base font-semibold text-gray-900">{activityTitle}</p>
          </div>

          {/* QR Code Display - Center */}
          <div className="flex justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <QRCode
                value={qrCodeUrl}
                size={256}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">📱 Hướng dẫn</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Hiển thị mã QR này trên màn hình hoặc máy chiếu</li>
              <li>✓ Sinh viên dùng camera điện thoại quét mã</li>
              <li>✓ Hệ thống tự động verify tham gia hoạt động</li>
            </ul>
          </div>

          {/* URL Display (Copyable) */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL QR</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={qrCodeUrl}
                readOnly
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-mono text-gray-600 truncate"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                className="flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleDownloadQr}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải QR
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
