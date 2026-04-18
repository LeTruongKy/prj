'use client'

import Link from 'next/link'
import { Heart, BookOpen, Zap, Palette, Lightbulb, Users } from 'lucide-react'

interface Category {
  category_id: number
  name: string
  color?: string
}

interface CategoriesSectionProps {
  categories: Category[]
}

const categoryConfig: Record<string, {
  icon: any
  gradient: string
  shadow: string
  textColor: string
  lightBg: string
}> = {
  'Tình nguyện': {
    icon: Heart,
    gradient: 'from-emerald-400 to-emerald-600',
    shadow: 'shadow-emerald-200 group-hover:shadow-emerald-300',
    textColor: 'text-emerald-700',
    lightBg: 'bg-emerald-50 group-hover:bg-emerald-100',
  },
  'Học thuật': {
    icon: BookOpen,
    gradient: 'from-blue-400 to-blue-700',
    shadow: 'shadow-blue-200 group-hover:shadow-blue-300',
    textColor: 'text-blue-700',
    lightBg: 'bg-blue-50 group-hover:bg-blue-100',
  },
  'Hội nhập & Kỹ năng': {
    icon: Lightbulb,
    gradient: 'from-amber-400 to-amber-600',
    shadow: 'shadow-amber-200 group-hover:shadow-amber-300',
    textColor: 'text-amber-700',
    lightBg: 'bg-amber-50 group-hover:bg-amber-100',
  },
  'Thể thao': {
    icon: Zap,
    gradient: 'from-orange-400 to-red-500',
    shadow: 'shadow-orange-200 group-hover:shadow-orange-300',
    textColor: 'text-orange-700',
    lightBg: 'bg-orange-50 group-hover:bg-orange-100',
  },
  'Văn nghệ': {
    icon: Palette,
    gradient: 'from-purple-400 to-purple-700',
    shadow: 'shadow-purple-200 group-hover:shadow-purple-300',
    textColor: 'text-purple-700',
    lightBg: 'bg-purple-50 group-hover:bg-purple-100',
  },
  'Kỹ năng': {
    icon: Lightbulb,
    gradient: 'from-pink-400 to-pink-600',
    shadow: 'shadow-pink-200 group-hover:shadow-pink-300',
    textColor: 'text-pink-700',
    lightBg: 'bg-pink-50 group-hover:bg-pink-100',
  },
}

const defaultConfig = {
  icon: Users,
  gradient: 'from-gray-400 to-gray-600',
  shadow: 'shadow-gray-200 group-hover:shadow-gray-300',
  textColor: 'text-gray-700',
  lightBg: 'bg-gray-50 group-hover:bg-gray-100',
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const displayCategories = categories.slice(0, 5)

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Khám phá
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Danh mục hoạt động
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Tham gia vào các hoạt động phong phú, đa dạng – nơi mỗi bạn trẻ đều tìm được
            đam mê của mình
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayCategories.map((category) => {
            const config = categoryConfig[category.name] || defaultConfig
            const IconComponent = config.icon

            return (
              <Link
                key={category.category_id}
                href={`/activities?category=${category.category_id}`}
                className="block"
              >
                <div className={`group flex flex-col items-center p-6 rounded-2xl border border-transparent hover:border-gray-200 ${config.lightBg} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}>
                  {/* Icon Container */}
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-4 shadow-lg ${config.shadow} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                  {/* Label */}
                  <p className={`font-bold text-sm text-center leading-tight ${config.textColor} transition-colors`}>
                    {category.name}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className={`w-4 h-4 ${config.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
