'use client'

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Thị A',
      role: 'Sinh viên Năm 3 · Khoa CNTT',
      avatar: 'A',
      avatarGradient: 'from-amber-400 to-orange-500',
      text: 'Nền tảng này đã giúp tôi khám phá nhiều hoạt động thú vị và phát triển kỹ năng của bản thân. Hệ thống quản lý tiến độ SV5T rất trực quan, giúp tôi theo dõi được hành trình của mình.',
      stars: 5,
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      borderColor: 'border-amber-100',
      accentColor: 'bg-amber-500',
    },
    {
      id: 2,
      name: 'Trần Văn B',
      role: 'Sinh viên Năm 2 · Khoa Kinh tế',
      avatar: 'B',
      avatarGradient: 'from-blue-400 to-blue-600',
      text: 'Tôi đã tham gia hơn 10 hoạt động và học được rất nhiều điều mới. Đây là nơi tuyệt vời để kết nối với những người cùng chí hướng và xây dựng mạng lưới quan hệ trong trường.',
      stars: 5,
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100',
      accentColor: 'bg-blue-500',
    },
    {
      id: 3,
      name: 'Phạm Thị C',
      role: 'Sinh viên Năm 1 · Khoa Nông nghiệp',
      avatar: 'C',
      avatarGradient: 'from-emerald-400 to-teal-600',
      text: 'Là sinh viên năm nhất, tôi cảm thấy rất được hỗ trợ khi tìm các hoạt động phù hợp. Giao diện rất thân thiện, dễ sử dụng và tính năng gợi ý AI cực kỳ chính xác!',
      stars: 5,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-100',
      accentColor: 'bg-emerald-500',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Phản hồi
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Tiếng Nói Sinh Viên
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Những câu chuyện truyền cảm hứng từ sinh viên đã trải nghiệm nền tảng LCHSVCT
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`${t.bgColor} border ${t.borderColor} rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}
            >
              {/* Quote Icon */}
              <div className="mb-5">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed flex-1 mb-6 italic font-medium">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/60">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center shadow-md shrink-0`}>
                  <span className="text-white font-extrabold text-lg">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{t.role}</p>
                </div>
                {/* Accent dot */}
                <div className={`ml-auto w-2 h-2 rounded-full ${t.accentColor}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
