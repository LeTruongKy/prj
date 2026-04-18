'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight } from 'lucide-react'

export default function DashboardHero() {
  const stats = [
    { number: '5,000+', label: 'Sinh viên tham gia', icon: '👥' },
    { number: '150+', label: 'Hoạt động tổ chức', icon: '📅' },
    { number: '60+', label: 'Năm truyền thống', icon: '🏛️' },
  ]

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)', boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08)' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/30 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-50/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />

      {/* Dot grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8 items-center mb-16">
          {/* Left Content (2/4 cols) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 backdrop-blur-sm border text-sm font-semibold px-4 py-2 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)', borderColor: 'rgba(37, 99, 235, 0.2)', color: 'rgb(37, 99, 235)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))' }} />
              Liên Chi Hội Sinh Viên CTU
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight" style={{ color: 'rgb(31, 41, 55)' }}>
                Khám Phá{' '}
                <span
                  className="relative text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(90deg, rgb(37, 99, 235), rgb(147, 51, 234))' }}
                >
                  Hoạt Động
                </span>
                <br />
                <span style={{ color: 'rgb(75, 85, 99)' }}>Sinh Viên</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: 'rgb(107, 114, 128)' }}>
              Tham gia hoạt động, tích lũy điểm rèn luyện và phát triển kỹ năng toàn diện
              thông qua hệ thống quản lý thông minh dành riêng cho sinh viên Đại học Cần Thơ.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link href="/activities" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 text-base flex items-center gap-2">
                  Khám phá hoạt động
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#activities" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto backdrop-blur-sm border-2 font-bold px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2 hover:opacity-90" style={{ background: 'transparent', borderColor: 'rgba(37, 99, 235, 0.3)', color: 'rgb(37, 99, 235)' }}>
                  Tìm hiểu thêm
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Video (2/4 cols) */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-end">
            <div className="relative w-full max-w-5xl">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl blur-2xl scale-110" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)' }} />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black" style={{ border: '4px solid rgba(37, 99, 235, 0.2)' }}>
                {/* Local Video Player */}
                <video
                  width="100%"
                  height="314"
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover rounded-3xl"
                >
                  <source src="/clip.mp4" type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
