'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight } from 'lucide-react'

export default function LandingHero() {
  const stats = [
    { number: '5,000+', label: 'Sinh viên', icon: '👥' },
    { number: '150+', label: 'Hoạt động', icon: '📅' },
    { number: '60+', label: 'Năm truyền thống', icon: '🏛️' },
  ]

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f2460 0%, #1e3a8a 30%, #1d4ed8 65%, #2563eb 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-300/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center mb-16">
          {/* Left Content */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Chào mừng đến với LCHSVCT
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
                Nền Tảng{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f97316)' }}
                >
                  Quản Lý
                </span>
                <br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f97316)' }}>
                  Hoạt Động
                </span>{' '}
                <span className="text-blue-100">Sinh Viên</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-xl">
              Tham gia hoạt động, tích lũy điểm rèn luyện và phát triển kỹ năng toàn diện
              thông qua hệ thống quản lý thông minh dành riêng cho sinh viên <strong className="text-white">Đại học Cần Thơ</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2">
                  Bắt Đầu Ngay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/20 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2">
                  Đăng Nhập
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-blue-100 font-medium">1,500+ sinh viên đang hoạt động</span>
              </div>
            </div>
          </div>

          {/* Right — Logo */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-2xl scale-110" />
              <div className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl shadow-black/30 bg-white/10 backdrop-blur-sm p-2">
                <div className="w-full h-full rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                  <img
                    src="/logo.jpg"
                    alt="CTU – Đại học Cần Thơ"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect fill="%231e3a8a" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" fill="%23fff" font-size="72" text-anchor="middle" dy="0.35em"%3ECTU%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-6 bg-white/15 backdrop-blur-xl rounded-2xl p-3.5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Đã xác nhận</p>
                    <p className="text-blue-200 text-xs">Hoạt động sắp tới</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-5 px-4 hover:bg-white/15 transition-colors"
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl sm:text-4xl font-extrabold text-white mb-1">{stat.number}</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
