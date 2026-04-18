'use client'

export default function OrganizationSection() {


  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Đội ngũ lãnh đạo
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Ban Chấp Hành Liên Chi Hội
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Những lãnh đạo trẻ tận tâm, nhiệt huyết cống hiến vì cộng đồng sinh viên Đại học Cần Thơ
          </p>
        </div>

        {/* BCH Banner Image */}
        <div className="relative rounded-3xl overflow-hidden mb-12 group">
          <img
            src="/BCH.jpg"
            alt="Ban Chấp Hành Liên Chi Hội"
            className="w-full h-64 sm:h-80 md:h-96 object-contain object-center group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent" />
          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-white font-bold text-xl sm:text-2xl mb-1">
              Ban Chấp Hành Liên Chi Hội Sinh Viên CTU
            </p>
            <p className="text-blue-200 text-sm">
              Nhiệm kỳ 2025 – 2027 · Đại học Cần Thơ
            </p>
          </div>
        </div>

        {/* Leaders Row */}


        {/* Divider */}

        {/* Members Grid */}
      </div>
    </section>
  )
}
