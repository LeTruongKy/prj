// File Upload Service
// Handles all file upload operations for avatar and proof submissions

import apiClient from './api'

export interface UploadResponse {
  message: string
  user?: {
    user_id: string
    email: string
    fullName: string
    avatarUrl: string
    updatedAt: string
  }
  registration?: {
    id: string
    proofUrl: string
    proofStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  }
}

export interface UploadOptions {
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

/**
 * Upload avatar file to Cloudinary via backend
 * @param file - Image file (JPG, PNG)
 * @param options - Upload options (onProgress callback, abort signal)
 * @returns Upload response with user data
 */
export async function uploadAvatar(
  file: File,
  options?: UploadOptions
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const response = await apiClient.patch('/users/me/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: options?.signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && options?.onProgress) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          options.onProgress(progress)
        }
      },
    })

    return response.data
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Upload cancelled')
    }
    throw new Error(
      error.response?.data?.message || 'Failed to upload avatar'
    )
  }
}

/**
 * Upload avatar with additional profile fields
 * @param file - Image file
 * @param profileData - Additional profile data (fullName, major)
 * @param options - Upload options
 * @returns Upload response
 */
export async function uploadAvatarWithProfile(
  file: File,
  profileData?: {
    fullName?: string
    major?: string
  },
  options?: UploadOptions
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('avatar', file)

  if (profileData?.fullName) {
    formData.append('fullName', profileData.fullName)
  }
  if (profileData?.major) {
    formData.append('major', profileData.major)
  }

  try {
    const response = await apiClient.patch('/users/me/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: options?.signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && options?.onProgress) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          options.onProgress(progress)
        }
      },
    })

    return response.data
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Upload cancelled')
    }
    throw new Error(
      error.response?.data?.message || 'Failed to upload avatar'
    )
  }
}

/**
 * Upload proof file to Cloudinary via backend
 * @param registrationId - Registration ID
 * @param file - Proof file (Image or PDF)
 * @param description - Optional description
 * @param options - Upload options
 * @returns Upload response with registration data
 */
export async function uploadProof(
  registrationId: string,
  file: File,
  description?: string,
  options?: UploadOptions
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('proofFile', file)

  if (description) {
    formData.append('description', description)
  }

  try {
    const response = await apiClient.patch(
      `/registrations/${registrationId}/proof`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: options?.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && options?.onProgress) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            options.onProgress(progress)
          }
        },
      }
    )

    return response.data
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Upload cancelled')
    }
    throw new Error(
      error.response?.data?.message || 'Failed to upload proof'
    )
  }
}

/**
 * Validate file before upload
 * @param file - File to validate
 * @param allowedTypes - Allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result with error message if invalid
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const formats = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
    return {
      valid: false,
      error: `Invalid file type. Allowed formats: ${formats}`,
    }
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    }
  }

  return { valid: true }
}

/**
 * Convert file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
