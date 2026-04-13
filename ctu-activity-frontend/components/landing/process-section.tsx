'use client'

import { UserPlus, Search, CalendarCheck, BarChart3 } from 'lucide-react'

export default function ProcessSection() {
  const steps = [
    {
      number: 1,
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản sinh viên miễn phí chỉ trong vài phút.',
      icon: UserPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      number: 2,
      title: 'Chọn hoạt động',
      description: 'Duyệt và lựa chọn hoạt động phù hợp với mục tiêu của bạn.',
      icon: Search,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      number: 3,
      title: 'Tham gia & Tích điểm',
      description: 'Tham gia hoạt động và tự động tích lũy điểm rèn luyện.',
      icon: CalendarCheck,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      number: 4,
      title: 'Theo dõi tiến độ',
      description: 'Xem tiến độ và thành tích phát triển cá nhân theo thời gian.',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Quy trình tham gia
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Bắt đầu hành trình phát triển trong 4 bước đơn giản
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative text-center group">
                {/* Connector Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-blue-200 to-blue-100"></div>
                )}

                {/* Icon Circle */}
                <div className={`inline-flex items-center justify-center h-20 w-20 ${step.bgColor} rounded-2xl mb-5 mx-auto group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className={`h-9 w-9 ${step.color}`} />
                </div>

                {/* Step Label */}
                <div className="mb-3">
                  <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    Bước {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
