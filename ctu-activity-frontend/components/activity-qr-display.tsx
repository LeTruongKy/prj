'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ActivityQrDisplayProps {
  qrCodeUrl?: string | null
  activityTitle: string
}

/**
 * Component to display QR code for activity check-in
 * 
 * Shows QR code in a dialog modal
 * QR URL format: https://abc.ngrok.app/checkin?activityId=1&timestamp=xxx&signature=yyy
 * 
 * When scanned with phone camera, opens /checkin page for check-in verification
 */
export function ActivityQrDisplay({ qrCodeUrl, activityTitle }: ActivityQrDisplayProps) {
  const [open, setOpen] = useState(false)

  // Don't render if no QR URL
  if (!qrCodeUrl) {
    return null
  }

  return (
    <>
      {/* Button to open QR code */}
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto"
      >
        📱 Hiển thị QR Code
      </Button>

      {/* QR Code Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Check-in</DialogTitle>
          </DialogHeader>

          {/* QR Code Display */}
          <div className="flex justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <QRCode
                value={qrCodeUrl}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {activityTitle}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dùng camera điện thoại để quét mã QR này
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Quét sẽ mở ứng dụng để xác thực tham gia
            </p>
          </div>

          {/* Debug Info (collapsible) */}
          <details className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 border-t pt-4">
            <summary className="font-medium">Xem chi tiết QR (Debug)</summary>
            <pre className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs max-h-32">
              {qrCodeUrl}
            </pre>
          </details>

          {/* Close Button */}
          <Button 
            onClick={() => setOpen(false)}
            className="w-full"
            variant="outline"
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
