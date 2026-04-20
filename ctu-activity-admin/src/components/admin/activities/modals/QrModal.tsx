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
    console.log('Canvas element for QR code:', canvas)
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
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-lg">QR Code Điểm Danh</DialogTitle>
          <DialogDescription className="text-xs">
            Quét mã để verify tham gia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Activity Title */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Hoạt động</p>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{activityTitle}</p>
          </div>

          {/* QR Code Display - Center */}
          <div className="flex justify-center p-2 bg-gray-50 rounded border border-gray-200">
            <div className="bg-white p-2 rounded shadow-sm">
              <QRCode
                value={qrCodeUrl}
                size={160}
                level="H"
                // includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <p className="text-xs font-medium text-blue-900 mb-1">📱 Hướng dẫn</p>
            <ul className="text-xs text-blue-800 space-y-0.5">
              <li>✓ Hiển thị mã QR trên màn hình</li>
              <li>✓ Sinh viên quét mã bằng camera</li>
              <li>✓ Hệ thống tự động verify</li>
            </ul>
          </div>

          {/* URL Display (Copyable) */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL</p>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={qrCodeUrl}
                readOnly
                className="flex-1 px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded font-mono text-gray-600 truncate"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                className="flex-shrink-0 h-8 w-8 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-8 text-sm"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
