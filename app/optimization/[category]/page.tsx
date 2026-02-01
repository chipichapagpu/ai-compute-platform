import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Breadcrumb from '@/components/optimization/Breadcrumb'
import TechniqueCard from '@/components/optimization/TechniqueCard'
import { getCategoryBySlug, getTechniquesByCategory, getBreadcrumbs, CATEGORIES } from '@/lib/optimization'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return { title: 'Not Found' }

  return {
    title: `${cat.title} — LLM Optimization | Computenomics`,
    description: cat.description
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = getCategoryBySlug(category)

  if (!cat) notFound()

  const techniques = getTechniquesByCategory(cat.slug)
  const breadcrumbs = getBreadcrumbs(category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <Breadcrumb items={breadcrumbs} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{cat.icon}</span>
            <h1 className="text-2xl font-bold text-slate-900">{cat.title}</h1>
          </div>
          <p className="text-slate-600 mb-4">{cat.description}</p>
          {cat.seoContent && (
            <p className="text-slate-500 text-sm leading-relaxed">{cat.seoContent}</p>
          )}
        </div>

        {/* Techniques Grid */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            {techniques.length} Techniques
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {techniques.map(t => (
              <TechniqueCard key={t.slug} technique={t} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
