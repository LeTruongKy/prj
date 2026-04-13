'use client'

import { useRef, ReactNode } from 'react'
import { Upload, X, ImageIcon, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadDropZoneProps {
  file: File | null
  preview: string | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  previewSize?: 'small' | 'medium' | 'large'
  showPreview?: boolean
  allowedFormats?: string
  children?: ReactNode
}

export function FileUploadDropZone({
  file,
  preview,
  onFileSelect,
  onFileRemove,
  accept = '.jpg,.jpeg,.png,.pdf',
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  previewSize = 'medium',
  showPreview = true,
  allowedFormats = 'JPG, PNG, PDF',
  children,
}: FileUploadDropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!disabled) {
      const files = e.dataTransfer.files
      if (files.length > 0) {
        onFileSelect(files[0])
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const previewHeightClass = {
    small: 'h-24',
    medium: 'h-48',
    large: 'h-64',
  }[previewSize]

  if (file && showPreview) {
    return (
      <div className="border border-border rounded-lg p-4 space-y-3">
        {/* Preview */}
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Preview"
              className={cn('w-full object-cover rounded border border-border', previewHeightClass)}
            />
          </div>
        ) : file.type === 'application/pdf' ? (
          <div className={cn('flex items-center justify-center w-full bg-muted rounded border border-border', previewHeightClass)}>
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
              {file.type.startsWith('image/') ? (
                <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {file.size > 1024
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : `${file.size} B`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFileRemove}
            disabled={disabled}
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
          disabled={disabled}
        >
          Chọn File Khác
        </Button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed border-border rounded-lg p-8 text-center',
        !disabled && 'hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer'
      )}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      {children ? (
        children
      ) : (
        <>
          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">
            Kéo thả tệp hoặc nhấp để chọn
          </p>
          <p className="text-xs text-muted-foreground">
            Hỗ trợ {allowedFormats} (tối đa {maxSize > 1024 * 1024 ? `${maxSize / (1024 * 1024)}MB` : `${maxSize / 1024}KB`})
          </p>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
