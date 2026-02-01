import Link from 'next/link'
import { CategoryMeta } from '@/data/optimization-categories'
import { getTechniqueCounts } from '@/lib/optimization'

interface CategoryGridProps {
  categories: CategoryMeta[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const counts = getTechniqueCounts()

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(cat => (
        <Link
          key={cat.slug}
          href={`/optimization/${cat.slug}`}
          className="p-5 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-sm transition-all bg-white group"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{cat.icon}</span>
            <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
              {cat.title}
            </h3>
          </div>
          <p className="text-sm text-slate-600 mb-3">{cat.description}</p>
          <div className="text-xs text-slate-500">
            {counts[cat.slug]} techniques
          </div>
        </Link>
      ))}
    </div>
  )
}
