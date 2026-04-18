'use client'

export default function AboutSection() {
  const stats = [
    { value: '60+', label: 'Năm nổi bật', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { value: '5,000+', label: 'Sinh viên năm nay', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { value: '150+', label: 'Hoạt động mỗi năm', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { value: '100%', label: 'Cam kết chất lượng', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left: Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Decorative background blob */}
              <div className="absolute -top-6 -left-6 w-full h-full rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 transform rotate-3" />

              {/* Main image */}
              <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/logo.jpg"
                  alt="60 Năm Đại Học Cần Thơ"
                  className="w-full h-72 sm:h-80 object-contain bg-gradient-to-br from-blue-50 to-white p-8"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320"%3E%3Crect fill="%23dbeafe" width="400" height="320"/%3E%3Ctext x="50%25" y="50%25" fill="%231e3a8a" font-size="48" text-anchor="middle" dy="0.35em"%3ECTU%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">🏛️</span>
                <div>
                  <p className="font-extrabold text-blue-700 text-lg leading-none">60</p>
                  <p className="text-xs text-gray-500 font-medium">Năm thành lập</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-orange-600 font-bold text-sm uppercase tracking-widest bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4">
                Về Chúng Tôi
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
                60 Năm{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #1e3a8a, #2563eb)' }}>
                  Đại học Cần Thơ
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Được thành lập năm 1966, Đại học Cần Thơ là một trong những trường đại học hàng đầu Việt Nam.
                Luôn đồng hành cùng sinh viên, chúng tôi cam kết đào tạo những tài năng trẻ với kỹ năng thực
                tiễn và giá trị nhân văn sâu sắc.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {[
                'Chương trình đào tạo chuẩn quốc tế',
                'Môi trường nghiên cứu hiện đại, năng động',
                'Hệ thống hỗ trợ sinh viên toàn diện',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`${stat.bg} ${stat.border} border rounded-2xl p-5 hover:shadow-md transition-shadow`}
                >
                  <p className={`text-3xl font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
