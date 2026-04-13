'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)' }}>
      {/* Decorative blur circles */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest">
                ✨ Chào mừng đến với LCHSVCT
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Nền Tảng Quản Lý{' '}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}>
                    Hoạt Động
                  </span>
                </span>{' '}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}>
                    Sinh Viên
                  </span>
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-lg">
              Tham gia hoạt động, tích lũy điểm rèn luyện và phát triển kỹ năng toàn diện thông qua hệ thống quản lý thông minh dành riêng cho sinh viên.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-base">
                  Bắt Đầu Ngay <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-xl text-base backdrop-blur-sm">
                  Khám Phá Hoạt Động
                </Button>
              </Link>
            </div>

            {/* Floating Badge */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-100 font-medium">1,500+ sinh viên đang hoạt động</span>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-md">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/8.jpg"
                  alt="Students collaborating"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Đã xác nhận</p>
                    <p className="text-blue-200 text-xs">Hoạt động sắp tới</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
