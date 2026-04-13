'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden px-8 sm:px-16 py-14 sm:py-20 text-center"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full filter blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Sẵn sàng bắt đầu hành trình của bạn?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-10">
              Tham gia cùng hàng ngàn sinh viên khác và bắt đầu quản lý hoạt động rèn luyện ngay hôm nay.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 py-3.5 rounded-xl text-base shadow-lg hover:shadow-xl transition-all">
                  Đăng ký miễn phí ngay <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
