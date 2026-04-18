'use client'

export default function StatisticsSection() {
  const statistics = [
    {
      number: '5,000+',
      label: 'Sinh viên',
      description: 'Đang sử dụng nền tảng',
      icon: '👥',
      gradient: 'from-blue-500 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100/50',
      border: 'border-blue-100',
      shadow: 'hover:shadow-blue-100',
      numberColor: 'text-blue-700',
    },
    {
      number: '150+',
      label: 'Hoạt động',
      description: 'Được tổ chức mỗi năm',
      icon: '📅',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100/50',
      border: 'border-orange-100',
      shadow: 'hover:shadow-orange-100',
      numberColor: 'text-orange-600',
    },
    {
      number: '10,000+',
      label: 'Lượt đăng ký',
      description: 'Tích lũy qua các kỳ',
      icon: '✅',
      gradient: 'from-emerald-500 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
      border: 'border-emerald-100',
      shadow: 'hover:shadow-emerald-100',
      numberColor: 'text-emerald-700',
    },
    {
      number: '50+',
      label: 'Đơn vị tổ chức',
      description: 'Khoa, phòng ban tham gia',
      icon: '🏫',
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100/50',
      border: 'border-purple-100',
      shadow: 'hover:shadow-purple-100',
      numberColor: 'text-purple-700',
    },
  ]

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #0f2460 0%, #1e3a8a 30%, #1d4ed8 65%, #2563eb 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-200 font-semibold text-sm uppercase tracking-widest mb-2">
            Con số nổi bật
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Những Con Số Ấn Tượng
          </h2>
          <p className="text-blue-200 mt-3 max-w-xl mx-auto">
            Khám phá quy mô và tác động của nền tảng LCHSVCT trong cộng đồng sinh viên Đại học Cần Thơ
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
            >
              {/* Background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />

              {/* Icon */}
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Number */}
              <p className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
                {stat.number}
              </p>

              {/* Label */}
              <p className="text-blue-100 font-bold text-base mb-1">{stat.label}</p>

              {/* Description */}
              <p className="text-blue-300 text-xs font-medium">{stat.description}</p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 group-hover:w-3/4 transition-all duration-500 bg-gradient-to-r ${stat.gradient} rounded-t-full`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
