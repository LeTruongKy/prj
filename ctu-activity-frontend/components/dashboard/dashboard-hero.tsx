'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-b-3xl" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)' }}>
      {/* Decorative blur circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Khám Phá Hoạt Động{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}>
                Sinh Viên
              </span>
            </h1>
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-lg">
              Tham gia các hoạt động, tích lũy điểm rèn luyện và phát triển kỹ năng của bạn mỗi ngày.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link href="/activities" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-5 rounded-xl text-md shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  Khám phá hoạt động
                </Button>
              </Link>
              <Link href="#progress" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-5 rounded-xl text-md shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  Xem hoạt động
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-72 h-60 rounded-3xl overflow-hidden shadow-xl border border-white/10">
              <img
                src="/8.jpg"
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
