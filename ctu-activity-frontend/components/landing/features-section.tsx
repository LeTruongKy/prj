'use client'

import { Calendar, TrendingUp, Zap, CheckCircle } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Quản lý sử dụng',
      description:
        'Tối ưu hóa việc theo dõi tất cả các hoạt động của bạn thông qua bảng điều khiển trực quan.',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      title: 'Theo dõi tiến độ',
      description:
        'Xem báo cáo chi tiết về tiến trình phát triển cá nhân và thành tích.',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
    },
    {
      icon: Zap,
      title: 'Gợi ý thông minh',
      description:
        'Nhận những gợi ý hoạt động phù hợp với sở thích và mục tiêu rèn luyện.',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
    },
    {
      icon: CheckCircle,
      title: 'Tích hợp điểm',
      description:
        'Đồng bộ hoạt động với hệ thống tính điểm rèn luyện một cách tự động.',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Trải nghiệm hệ thống quản lý hiện đại giúp đỡ công cụ cho mỗi sinh viên.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl ${feature.lightColor} mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`h-7 w-7 ${feature.color.replace('bg-', 'text-')}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
