'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { FileUploadDropZone } from '@/components/ui/file-upload'
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import apiClient from '@/lib/api'

interface UserProfile {
  user_id: string
  email: string
  fullName: string
  studentCode: string
  major: string
  unitId: number
  unitName: string
  avatarUrl?: string
}

interface EditProfileModalProps {
  user: UserProfile
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export default function EditProfileModal({ user, open, onOpenChange, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    major: user.major,
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
  const MAX_AVATAR_SIZE = 5 * 1024 * 1024

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarSelect = (file: File) => {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Chỉ hỗ trợ file .jpg hoặc .png cho ảnh đại diện')
      setAvatarFile(null)
      setAvatarPreview(null)
      return
    }

    // Validate file size
    if (file.size > MAX_AVATAR_SIZE) {
      setError('Kích thước file không được vượt quá 5MB')
      setAvatarFile(null)
      setAvatarPreview(null)
      return
    }

    setError(null)
    setAvatarFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarRemove = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setUploadProgress(0)

    try {
      if (avatarFile) {
        // Upload with file
        const uploadFormData = new FormData()
        uploadFormData.append('avatar', avatarFile)
        uploadFormData.append('fullName', formData.fullName)
        uploadFormData.append('major', formData.major)

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

        if (response.data) {
          toast({
            title: 'Thành công!',
            description: 'Hồ sơ đã được cập nhật thành công',
            variant: 'default',
          })
          onSave()
          onOpenChange(false)
        }
      } else {
        // Update without file (backward compatible)
        const response = await apiClient.patch('/users/me/profile', {
          fullName: formData.fullName,
          major: formData.major,
        })

        if (response.data) {
          toast({
            title: 'Thành công!',
            description: 'Hồ sơ đã được cập nhật thành công',
            variant: 'default',
          })
          onSave()
          onOpenChange(false)
        }
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Cập nhật hồ sơ thất bại'
      setError(errorMsg)
      toast({
        title: 'Lỗi!',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Hồ Sơ</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ảnh Đại Diện</Label>
            <FileUploadDropZone
              file={avatarFile}
              preview={avatarPreview}
              onFileSelect={handleAvatarSelect}
              onFileRemove={handleAvatarRemove}
              accept=".jpg,.jpeg,.png"
              disabled={loading}
              previewSize="small"
              allowedFormats="JPG, PNG"
            />
            <p className="text-xs text-muted-foreground">
              Nhấp vào ảnh hiện tại hoặc kéo thả ảnh mới để thay đổi
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Họ và Tên
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major" className="text-sm font-medium">
              Chuyên Ngành
            </Label>
            <Input
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập chuyên ngành"
            />
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Đang tải lên ảnh...</p>
                <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang cập nhật...
              </>
            ) : (
              'Lưu Thay Đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
