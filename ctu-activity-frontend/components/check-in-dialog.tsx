'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface CheckInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckInDialog({ open, onOpenChange }: CheckInDialogProps) {
  const [qrCode, setQrCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!qrCode.trim()) {
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implement actual QR code verification API call
      // Example: await verifyQRCode(qrCode)
      console.log('[v0] QR Code submitted:', qrCode)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitted(true)

      // Auto-close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
        setQrCode('')
        setSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error('[v0] QR verification error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setQrCode('')
      setSubmitted(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check-in via QR Code</DialogTitle>
          <DialogDescription>
            Enter or paste the QR code string to check in to this activity.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Check-in Successful!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your attendance has been recorded.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-code" className="text-sm font-medium">
                QR Code
              </Label>
              <Input
                id="qr-code"
                placeholder="Paste QR code or scan here..."
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Scan the QR code provided at the activity venue or paste the code string.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleSubmit}
              disabled={!qrCode.trim() || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
            >
              {isLoading ? 'Verifying...' : 'Verify & Check In'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
