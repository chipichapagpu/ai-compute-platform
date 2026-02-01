import { Metadata } from 'next'
import Header from '@/components/Header'
import CategoryGrid from '@/components/optimization/CategoryGrid'
import { CATEGORIES } from '@/lib/optimization'

export const metadata: Metadata = {
  title: 'LLM Optimization Library | Computenomics',
  description: 'Comprehensive guide to LLM inference optimization techniques. Quantization, attention mechanisms, KV-cache, batching, and more.'
}

export default function OptimizationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            LLM Optimization Library
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Technical reference for inference optimization techniques.
            Reduce VRAM, increase throughput, and deploy efficiently.
          </p>
        </div>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Categories</h2>
          <CategoryGrid categories={CATEGORIES} />
        </section>
      </main>
    </div>
  )
}
