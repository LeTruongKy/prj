'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
interface LoginFormProps {
  returnUrl?: string | null
}

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm({ returnUrl }: LoginFormProps) {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isValidating },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log('Submitting login form with data:', data)
    clearError()

    try {
      await login(data.email, data.password)
      // Redirect to activities on success
      if (returnUrl) {
      router.push(decodeURIComponent(returnUrl))
    } else {
      router.push('/')
    }
    } catch (error) {
      // Error is already stored in the store
      console.error('Login error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm ml-2">{error}</AlertDescription>
        </Alert>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
          Địa chỉ
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@ctu.edu.vn"
            disabled={isLoading || isValidating}
            className={`pl-12 h-11 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-900">
            Mật khẩu
          </Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isLoading || isValidating}
            className={`pl-12 pr-12 h-11 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      {/* <div className="flex items-center space-x-3 pt-2">
        <input
          id="rememberMe"
          type="checkbox"
          disabled={isLoading || isValidating}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600"
          {...register('rememberMe')}
        />
        <label
          htmlFor="rememberMe"
          className="text-sm text-gray-700 cursor-pointer font-medium"
        >
          Stay signed in for 30 days
        </label>
      </div> */}

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={isLoading || isValidating}
        className="w-full h-12 mt-8 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl
          transform transition-all duration-200 hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
          bg-gradient-to-r from-blue-600 to-purple-600"
      >
        {isLoading || isValidating ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" stroke="currentColor"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
           Đăng nhập
          </span>
        ) : (
          'Đăng nhập'
        )}
      </Button>
    </form>
  )
}
