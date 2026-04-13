'use client'

import { useEffect, useState } from 'react'
import { useApiStatusStore } from '@/lib/api-status-store'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ApiStatusIndicator() {
  const { isConnected, mockMode } = useApiStatusStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-background border border-border shadow-lg">
      <div
        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
      />
      <span className="text-xs font-medium text-muted-foreground">
        {isConnected ? (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            API Connected
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {mockMode ? 'Mock Mode' : 'API Error'}
          </span>
        )}
      </span>
    </div>
  )
}
