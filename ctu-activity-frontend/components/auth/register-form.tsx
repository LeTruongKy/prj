'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { getUnits, Unit } from '@/lib/activity-service'
import { useToast } from '@/hooks/use-toast'

// Zod validation schema
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Tên đầy đủ là bắt buộc')
      .min(3, 'Tên đầy đủ phải có ít nhất 3 ký tự'),
    studentCode: z
      .string()
      .min(1, 'Mã sinh viên là bắt buộc')
      .regex(
        /^[A-Za-z0-9]{7,8}$/,
        'Mã sinh viên phải có 7-8 ký tự chữ số (ví dụ: B2012345)'
      ),
    email: z
      .string()
      .min(1, 'Email là bắt buộc')
      .email('Vui lòng nhập địa chỉ email hợp lệ')
      .refine(
        (email) => email.endsWith('@ctu.edu.vn'),
        'Email phải là địa chỉ Đại học Cần Thơ (@ctu.edu.vn)'
      ),
    unitId: z
      .string()
      .min(1, 'Lựa chọn đơn vị là bắt buộc'),
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu của bạn'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { toast } = useToast()
  const [units, setUnits] = useState<Unit[]>([])
  const [unitsLoading, setUnitsLoading] = useState(true)
  const [unitsError, setUnitsError] = useState<string | null>(null)

  // Fetch units on component mount
  useEffect(() => {
    const fetchUnitsData = async () => {
      try {
        setUnitsLoading(true)
        const response = await getUnits()
        // Extract units from response structure
        const unitsData = response.data
        setUnits(unitsData.data)
      } catch (err) {
        console.error('[Local API] Error fetching units:', err)
        setUnitsError('Không thể tải danh sách đơn vị')
      } finally {
        setUnitsLoading(false)
      }
    }

    fetchUnitsData()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isValidating },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!password) return null
    if (password.length < 6) return 'weak'
    if (password.length < 10) return 'medium'
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong'
    return 'medium'
  }, [password])

  const onSubmit = async (data: RegisterFormData) => {
    clearError()
    setSuccessMessage('')

    try {
      const unitId = data.unitId ? parseInt(data.unitId) : undefined
      await registerUser(data.fullName, data.studentCode, data.email, data.password, unitId)
      // Show success message
      setSuccessMessage('Tài khoản tạo thành công! Chuyển hướng đến đăng nhập...')
      toast({
        title: 'Thành công!',
        description: 'Đăng ký tài khoản thành công',
        variant: 'default',
      })
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Lỗi!',
        description: error instanceof Error ? error.message : 'Đăng ký thất bại',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {successMessage && (
        <Alert className="bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm ml-2">{successMessage}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm ml-2">{error}</AlertDescription>
        </Alert>
      )}

      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-900">
          Họ và tên
        </Label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <Input
            id="fullName"
            type="text"
            placeholder="Nguyễn Văn A"
            disabled={isLoading || isValidating}
            className={`pl-12 h-11 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Student Code Field */}
      <div className="space-y-2">
        <Label htmlFor="studentCode" className="text-sm font-semibold text-gray-900">
          Mã số sinh viên
        </Label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m0 0h5a2 2 0 002-2V8a2 2 0 00-2-2h-5m0 0V5a2 2 0 012-2h1a2 2 0 012 2v1m0 0h5a2 2 0 012 2v10a2 2 0 01-2 2h-5m0 0V7m0 0H7m12 0v10m0 0l-3-3m3 3l3-3" />
          </svg>
          <Input
            id="studentCode"
            type="text"
            placeholder="B2012345"
            disabled={isLoading || isValidating}
            className={`pl-12 h-11 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 uppercase
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.studentCode ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('studentCode')}
          />
        </div>
        {errors.studentCode && (
          <p className="text-sm text-red-600 mt-1">{errors.studentCode.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
          Email
        </Label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <Input
            id="email"
            type="email"
            placeholder="student@ctu.edu.vn"
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

      {/* Unit Selection Field */}
      <div className="space-y-2">
        <Label htmlFor="unitId" className="text-sm font-semibold text-gray-900">
          Đơn vị
        </Label>
        {unitsError && (
          <p className="text-sm text-red-600 mb-2">{unitsError}</p>
        )}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <Select
            onValueChange={(value) => setValue('unitId', value)}
            disabled={unitsLoading || isLoading || isValidating}
          >
            <SelectTrigger
              id="unitId"
              className={`pl-12 h-11 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
                ${errors.unitId ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Chọn đơn vị hoặc khoa của bạn..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300">
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id.toString()}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.unitId && (
          <p className="text-sm text-red-600 mt-1">{errors.unitId.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-gray-900">
          Mật khẩu
        </Label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0 0h.01M7 11a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
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
        {password && passwordStrength && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  passwordStrength === 'weak'
                    ? 'w-1/3 bg-red-500'
                    : passwordStrength === 'medium'
                      ? 'w-2/3 bg-yellow-500'
                      : 'w-full bg-green-500'
                }`}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 capitalize">
              {passwordStrength}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900">
          Xác nhận mật khẩu
        </Label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0 0h.01M7 11a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isLoading || isValidating}
            className={`pl-12 pr-12 h-11 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
        )}
        {password && confirmPassword && password === confirmPassword && (
          <div className="flex items-center gap-2 text-green-600 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Mật khẩu khớp</span>
          </div>
        )}
      </div>

      {/* Terms & Privacy Checkbox */}
      {/* <div className="flex items-start space-x-3 pt-2">
        <input
          id="agreeTerms"
          type="checkbox"
          disabled={isLoading || isValidating}
          className="mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600"
          defaultChecked={false}
        />
        <label
          htmlFor="agreeTerms"
          className="text-sm text-gray-700 cursor-pointer"
        >
          Tôi đồng ý với{' '}
          <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
            Điều khoản
          </Link>
          {' '}và{' '}
          <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
            Chính sách Quyền riêng tư
          </Link>
        </label>
      </div> */}

      {/* Create Account Button */}
      <button
        type="submit"
        disabled={isLoading || isValidating}
        className="w-full h-12 mt-8 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl
          transform transition-all duration-200 hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        style={{
          background: isLoading || isValidating 
            ? 'linear-gradient(90deg, rgb(37, 99, 235) 0%, rgb(147, 51, 234) 100%)'
            : 'linear-gradient(90deg, rgb(37, 99, 235) 0%, rgb(147, 51, 234) 100%)',
        }}
      >
        {isLoading || isValidating ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" stroke="currentColor"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            Đang tạo tài khoản...
          </span>
        ) : (
          'Tạo Tài Khoản'
        )}
      </button>
    </form>
  )
}
