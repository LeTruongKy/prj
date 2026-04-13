'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, X, CheckCircle2, AlertCircle, Image as ImageIcon, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import apiClient from '@/lib/api'

interface ProofUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registrationId: string
  onSuccess?: () => void
}

export function ProofUploadModal({
  open,
  onOpenChange,
  registrationId,
  onSuccess,
}: ProofUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Chỉ hỗ trợ file .jpg, .png hoặc .pdf')
      setSelectedFile(null)
      setPreview(null)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Kích thước file không được vượt quá 5MB')
      setSelectedFile(null)
      setPreview(null)
      return
    }

    setError(null)
    setSelectedFile(file)

    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // For PDF, show a document icon instead
      setPreview(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file minh chứng')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('proofFile', selectedFile)
      if (description.trim()) {
        formData.append('description', description)
      }

      const response = await apiClient.patch(
        `/registrations/${registrationId}/proof`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
              setUploadProgress(progress)
            }
          },
        }
      )

      if (response.data) {
        setSuccess(true)
        toast({
          title: 'Thành công!',
          description: 'Minh chứng đã được nộp và chờ xác nhận',
          variant: 'default',
        })

        // Auto-close dialog after 2 seconds
        setTimeout(() => {
          onOpenChange(false)
          resetForm()
          onSuccess?.()
        }, 2000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Nộp minh chứng thất bại'
      setError(errorMsg)
      toast({
        title: 'Lỗi!',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreview(null)
    setDescription('')
    setUploadProgress(0)
    setError(null)
    setSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nộp Minh Chứng Tham Gia Hoạt Động</DialogTitle>
          <DialogDescription>
            Tải lên ảnh hoặc tài liệu chứng minh sự tham gia của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Area */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Tải lên tệp (ảnh hoặc PDF)
            </Label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Kéo thả tệp hoặc nhấp để chọn
                </p>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ JPG, PNG, PDF (tối đa 5MB)
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 space-y-4">
                {/* File Preview */}
                <div className="space-y-3">
                  {preview ? (
                    <div className="relative inline-block w-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-48 object-cover rounded border border-border"
                      />
                      <div className="absolute top-2 right-2 bg-green-500/90 rounded-full p-1">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ) : selectedFile?.type === 'application/pdf' ? (
                    <div className="flex items-center justify-center w-full h-40 bg-muted rounded border border-border">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">PDF Document</p>
                      </div>
                    </div>
                  ) : null}

                  {/* File Info */}
                  <div className="flex items-start justify-between bg-muted p-3 rounded">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div>
                        {selectedFile?.type.startsWith('image/') ? (
                          <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {selectedFile?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile?.size ?? 0) > 1024
                            ? `${((selectedFile?.size ?? 0) / 1024).toFixed(2)} KB`
                            : `${selectedFile?.size} B`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreview(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Change File Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    Chọn File Khác
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Mô Tả (tùy chọn)
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn về minh chứng của bạn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Đang tải lên...</p>
                <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Success State */}
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                Minh chứng đã được nộp thành công!
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {error && !success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting || success}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang tải lên...
              </>
            ) : (
              'Xác Nhận Nộp'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
