'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import apiClient from '@/lib/api'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentAvatarUrl?: string
  userId: string
  onSuccess?: (newAvatarUrl: string) => void
  size?: 'sm' | 'md' | 'lg'
  clickable?: boolean
}

export function AvatarUpload({
  currentAvatarUrl,
  userId,
  onSuccess,
  size = 'md',
  clickable = true,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const ALLOWED_TYPES = ['image/jpeg', 'image/png']
  const MAX_FILE_SIZE = 5 * 1024 * 1024

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Chỉ hỗ trợ file .jpg hoặc .png')
      toast({
        title: 'Lỗi!',
        description: 'Chỉ hỗ trợ file .jpg hoặc .png',
        variant: 'destructive',
      })
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Kích thước file không được vượt quá 5MB')
      toast({
        title: 'Lỗi!',
        description: 'Kích thước file không được vượt quá 5MB',
        variant: 'destructive',
      })
      return
    }

    setError(null)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('avatar', file)

      const response = await apiClient.patch('/users/me/profile', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            setUploadProgress(progress)
          }
        },
      })

      if (response.data?.user?.avatarUrl) {
        toast({
          title: 'Thành công!',
          description: 'Ảnh đại diện đã được cập nhật',
          variant: 'default',
        })
        onSuccess?.(response.data.user.avatarUrl)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Cập nhật ảnh đại diện thất bại'
      setError(errorMsg)
      toast({
        title: 'Lỗi!',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    if (clickable && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Container */}
      <div
        className={cn(
          'relative group rounded-full overflow-hidden border-2 border-border',
          sizeClasses[size],
          clickable && !isUploading && 'cursor-pointer hover:border-primary transition-colors'
        )}
        onClick={handleClick}
      >
        {/* Avatar Image */}
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Avatar</span>
          </div>
        )}

        {/* Overlay on Hover */}
        {clickable && !isUploading && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-6 h-6 text-white mx-auto mb-1" />
              <p className="text-xs text-white font-medium">Thay đổi</p>
            </div>
          </div>
        )}

        {/* Upload Progress Overlay */}
        {isUploading && uploadProgress < 100 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-3/4">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-xs text-white text-center mt-1">{uploadProgress}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="w-full max-w-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2 text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Status */}
      {isUploading && (
        <p className="text-sm text-muted-foreground">Đang tải lên...</p>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Instruction Text */}
      {clickable && !isUploading && (
        <p className="text-xs text-muted-foreground text-center">
          Nhấp vào ảnh để thay đổi ảnh đại diện
        </p>
      )}
    </div>
  )
}
