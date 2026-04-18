"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface PosterUploadFieldProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Component for uploading activity poster images
 * - Dropzone with drag-and-drop support
 * - File validation (type: JPEG, PNG, GIF, WebP; size: max 5MB)
 * - Image preview
 * - Remove file button
 */
export function PosterUploadField({
  value,
  onChange,
  disabled = false,
  error,
}: PosterUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(error || null);

  // ✅ File validation function
  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Chỉ hỗ trợ định dạng JPEG, PNG, GIF, hoặc WebP";
    }

    if (file.size > maxSize) {
      return "Kích thước file không được vượt quá 5MB";
    }

    return null;
  };

  // ✅ Handle file selection or drop
  const handleFileSelect = (file: File) => {
    const error = validateFile(file);

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);

    // ✅ Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  // ✅ Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // ✅ Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  // ✅ Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // ✅ Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // ✅ Remove file
  const handleRemoveFile = () => {
    onChange(null);
    setPreview(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Render preview
  if (preview && value) {
    return (
      <div className="space-y-3">
        <div className="relative w-full rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          {/* Preview Image */}
          <div className="relative w-full h-64">
            <Image
              src={preview}
              alt="Poster preview"
              fill
              className="object-cover"
            />
          </div>

          {/* Remove Button Overlay */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveFile}
            disabled={disabled}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
            Xóa
          </Button>

          {/* File Info */}
          <div className="p-3 bg-white border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>{value.name}</strong> • {(value.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        {/* Change File Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Chọn ảnh khác
        </Button>
      </div>
    );
  }

  // ✅ Render dropzone (no file selected)
  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400 hover:bg-blue-50"}`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Kéo thả ảnh vào đây hoặc {" "}
            <span className="text-blue-600 font-semibold">chọn từ máy tính</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG, PNG, GIF hoặc WebP • Tối đa 5MB
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600 font-semibold text-sm">
            ✕
          </span>
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}
    </div>
  );
}
