'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden px-8 sm:px-16 py-16 sm:py-24 text-center"
          style={{
            background: 'linear-gradient(135deg, #0f2460 0%, #1e3a8a 30%, #1d4ed8 65%, #2563eb 100%)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mb-6">
              <span className="text-3xl">🚀</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Sẵn Sàng Tham Gia{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f97316)' }}
              >
                Cùng Chúng Tôi?
              </span>
            </h2>

            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Hãy bắt đầu hành trình phát triển kỹ năng và tích lũy kinh nghiệm cùng{' '}
              <span className="text-white font-bold">hàng ngàn sinh viên</span> khác ngay hôm nay.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 flex items-center gap-2">
                  Đăng Ký Ngay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/activities">
                <Button className="bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/20 font-bold px-10 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                  Tìm Hiểu Thêm
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-blue-200 text-sm">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Miễn phí hoàn toàn
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Dành riêng cho sinh viên CTU
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                5,000+ sinh viên tham gia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
