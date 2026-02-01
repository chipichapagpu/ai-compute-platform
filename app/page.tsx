import Link from 'next/link'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="py-20 text-center">
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Compute economics for<br />AI infrastructure
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            Plan and reason about AI compute using first-principles math and real hardware constraints.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start Compute Planning
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Link>
          <p className="text-sm text-slate-500 mt-4">From model size to hardware limits — in one flow</p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <Link href="/hardware" className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:border-red-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">GPU Comparison</h3>
            <p className="text-slate-500 text-sm">Side-by-side analysis of modern AI accelerators. Memory, bandwidth, interconnects.</p>
          </Link>

          <Link href="/calculator" className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:border-blue-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">VRAM Estimator</h3>
            <p className="text-slate-500 text-sm">Transparent memory sizing for LLMs. Weights, KV-cache, precision, safety margins.</p>
          </Link>

          <Link href="/infrastructure" className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:border-purple-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Compute Industry Insights</h3>
            <p className="text-slate-500 text-sm">Analytics across data centers, hardware supply, and LLM workloads.</p>
          </Link>
        </div>

        {/* About Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">What you can do</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">•</span>
                Estimate VRAM requirements for inference and training
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">•</span>
                Compare modern AI accelerators beyond peak FLOPs
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">•</span>
                Understand trade-offs: context length, batch size, precision, parallelism
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">•</span>
                Connect model-level choices to cost and scalability
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Philosophy</h3>
            <p className="text-slate-600 mb-4">
              A technical planning tool for people who design, deploy, and scale LLM systems.
              Focused on how models actually consume memory and bandwidth.
            </p>
            <p className="text-slate-500 text-sm">
              No benchmarks for marketing. No abstract performance scores.
              All assumptions are explicit and inspectable.
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}
