import { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In | SAMS-CTU',
  description: 'Sign in to your SAMS account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* LEFT SIDE - HERO SECTION */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between p-10 text-white relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 100%)',
        }}
      >
        {/* Decorative blur circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-72 h-72 bg-purple-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-56 h-56 bg-blue-300/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Top - Logo & Dark/Light icons */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422A12.083 12.083 0 0121 12.75c0 1.194-.232 2.333-.654 3.375L12 21l-8.346-4.875A12.054 12.054 0 013 12.75c0-1.194.232-2.333.654-3.375L12 14z" opacity="0.6" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">SAMS</span>
          </div>

          {/* Middle - Hero Text */}
          <div className="space-y-5 max-w-lg">
            <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
              Welcome to SAMS
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed max-w-md">
              Nền tảng quản lý hoạt động sinh viên hiện đại. Tham gia, tích lũy
              và phát triển kỹ năng.
            </p>
          </div>

          {/* Bottom - Image + Stats */}
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-w-md">
              <img
                src="/8.jpg"
                alt="Students collaborating"
                className="w-full h-52 object-cover"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-3 left-3 bg-white/15 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  TRUSTED BY
                </span>
              </div>
              <div className="absolute bottom-3 left-3 mt-8 bg-transparent rounded-xl px-4 py-8 flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  15,000+ Students
                </span>
              </div>
            </div>

            {/* Ecosystem icons row */}
            <div className="flex items-center gap-6">
              <span className="text-xs font-semibold text-blue-200 tracking-widest uppercase">
                Ecosystem
              </span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 py-12 sm:px-8 lg:px-16 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="flex lg:hidden justify-center mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(147, 51, 234) 100%)',
              }}
            >
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>

          {/* Avatar Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 border border-gray-100">
            {/* Login Form - preserves all original functionality */}
            <LoginForm />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm font-medium text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">Chưa có tài khoản?</p>
            <Link
              href="/register"
              className="inline-block w-full max-w-xs py-3 px-6 rounded-full border-2 border-blue-600 text-blue-600 font-semibold text-center
                hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Đăng ký ngay
            </Link>
          </div>

          {/* Footer */}
          {/* <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 mb-3 tracking-wide">
              © 2024 SAMS UNIVERSITY ACTIVITY MANAGEMENT. ALL RIGHTS RESERVED.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors font-medium tracking-wide uppercase"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors font-medium tracking-wide uppercase"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors font-medium tracking-wide uppercase"
              >
                Contact Support
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
