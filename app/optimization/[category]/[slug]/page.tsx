import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Breadcrumb from '@/components/optimization/Breadcrumb'
import MetricBadge from '@/components/optimization/MetricBadge'
import TLDRBox from '@/components/optimization/TLDRBox'
import CodeBlock from '@/components/optimization/CodeBlock'
import ReferenceList from '@/components/optimization/ReferenceList'
import TechniqueCard from '@/components/optimization/TechniqueCard'
import { getTechniqueBySlug, getRelatedTechniques, getBreadcrumbs, TECHNIQUES } from '@/lib/optimization'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  return TECHNIQUES.map(t => ({
    category: t.category,
    slug: t.slug
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const technique = getTechniqueBySlug(slug)
  if (!technique) return { title: 'Not Found' }

  return {
    title: `${technique.title} — LLM Optimization | Computenomics`,
    description: technique.summary.slice(0, 160)
  }
}

const hardwareLabels: Record<string, string> = {
  nvidia: 'NVIDIA',
  amd: 'AMD',
  apple: 'Apple Silicon',
  cpu: 'CPU'
}

export default async function TechniquePage({ params }: Props) {
  const { category, slug } = await params
  const technique = getTechniqueBySlug(slug)

  if (!technique || technique.category !== category) notFound()

  const breadcrumbs = getBreadcrumbs(category, slug)
  const related = getRelatedTechniques(technique)

  // Parse markdown sections from description
  const sections = technique.description.split(/^## /m).filter(Boolean)
  const overview = sections[0]
  const otherSections = sections.slice(1).map(s => {
    const [title, ...content] = s.split('\n')
    return { title, content: content.join('\n').trim() }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <Breadcrumb items={breadcrumbs} />

        <div className="lg:grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Main Content */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-3">{technique.title}</h1>

              {technique.metrics && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {technique.metrics.vramReduction && (
                    <MetricBadge label="VRAM" value={technique.metrics.vramReduction} variant="green" />
                  )}
                  {technique.metrics.speedup && (
                    <MetricBadge label="Speed" value={technique.metrics.speedup} variant="blue" />
                  )}
                  {technique.metrics.qualityRetention && (
                    <MetricBadge label="Quality" value={technique.metrics.qualityRetention} variant="purple" />
                  )}
                </div>
              )}
            </div>

            {/* TL;DR */}
            <div className="mb-8">
              <TLDRBox
                summary={technique.summary}
                useWhen={technique.useWhen}
                skipWhen={technique.skipWhen}
              />
            </div>

            {/* Overview */}
            <section className="mb-8">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line">{overview}</p>
              </div>
            </section>

            {/* Other Sections */}
            {otherSections.map((section, i) => (
              <section key={i} className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">{section.title}</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 whitespace-pre-line">{section.content}</p>
                </div>
              </section>
            ))}

            {/* Code Examples */}
            {technique.codeExamples && technique.codeExamples.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Code Examples</h2>
                <div className="space-y-4">
                  {technique.codeExamples.map((ex, i) => (
                    <CodeBlock key={i} title={ex.title} language={ex.language} code={ex.code} />
                  ))}
                </div>
              </section>
            )}

            {/* References */}
            <section className="mb-8">
              <ReferenceList references={technique.references} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Hardware */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Supported Hardware</h3>
              <div className="flex flex-wrap gap-2">
                {technique.hardware.map(hw => (
                  <span key={hw} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {hardwareLabels[hw] || hw}
                  </span>
                ))}
              </div>
            </div>

            {/* Frameworks */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {technique.frameworks.map(fw => (
                  <span key={fw} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {fw}
                  </span>
                ))}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Related Techniques</h3>
                <div className="space-y-3">
                  {related.slice(0, 3).map(t => (
                    <Link
                      key={t.slug}
                      href={`/optimization/${t.category}/${t.slug}`}
                      className="block p-3 rounded-lg border border-slate-200 hover:border-red-300 bg-white transition-colors"
                    >
                      <div className="font-medium text-sm text-slate-900 mb-1">{t.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{t.summary}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
