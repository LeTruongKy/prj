'use client'

import Link from 'next/link'
import { Heart, BookOpen, Zap, Palette, Lightbulb } from 'lucide-react'

interface Category {
  category_id: number
  name: string
  color?: string
}

interface CategoriesSectionProps {
  categories: Category[]
}

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  'Tình nguyện': Heart,
  'Học thuật': BookOpen,
  'Hội nhập & Kỹ năng': Lightbulb,
  'Thể thao': Zap,
  'Văn nghệ': Palette,
  'Kỹ năng': Lightbulb,
}

const categoryStyles: { [key: string]: { bgColor: string; iconBg: string; iconColor: string } } = {
  'Tình nguyện': { bgColor: 'bg-emerald-50', iconBg: 'bg-emerald-500', iconColor: 'text-white' },
  'Học thuật': { bgColor: 'bg-blue-50', iconBg: 'bg-blue-500', iconColor: 'text-white' },
  'Hội nhập & Kỹ năng': { bgColor: 'bg-amber-50', iconBg: 'bg-amber-500', iconColor: 'text-white' },
  'Thể thao': { bgColor: 'bg-orange-50', iconBg: 'bg-orange-500', iconColor: 'text-white' },
  'Văn nghệ': { bgColor: 'bg-purple-50', iconBg: 'bg-purple-500', iconColor: 'text-white' },
  'Kỹ năng': { bgColor: 'bg-pink-50', iconBg: 'bg-pink-500', iconColor: 'text-white' },
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  // Display top 5 categories
  const displayCategories = categories.slice(0, 5)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Danh mục hoạt động
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {displayCategories.map((category) => {
          const IconComponent = categoryIcons[category.name] || Heart
          const style = categoryStyles[category.name] || {
            bgColor: 'bg-gray-50',
            iconBg: 'bg-gray-500',
            iconColor: 'text-white',
          }

          return (
            <Link
              key={category.category_id}
              href={`/activities?category=${category.category_id}`}
            >
              <div className="text-center group cursor-pointer">
                {/* Icon Circle */}
                <div
                  className={`${style.iconBg} w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}
                >
                  <IconComponent className={`w-9 h-9 sm:w-11 sm:h-11 ${style.iconColor}`} />
                </div>

                {/* Label */}
                <p className="font-semibold text-sm text-gray-900 text-center leading-tight">
                  {category.name}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
