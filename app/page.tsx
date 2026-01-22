import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">◆</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI Compute Planner</h1>
                <p className="text-sm text-slate-500">Infrastructure Planning Tools</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/hardware"
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
              >
                Hardware
              </Link>
              <Link
                href="/infrastructure"
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
              >
                Infrastructure
              </Link>
              <Link
                href="/calculator"
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Planner
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            AI Compute Planner
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Estimate VRAM requirements, compare AI accelerators, and plan your infrastructure
            for LLM deployment. High-performance silicon insights for engineers and product leads.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link href="/hardware" className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:border-red-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Compare Hardware</h3>
            <p className="text-slate-600">Benchmarking 26+ AI accelerators including H100, B200, and TPUs</p>
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
            <p className="text-slate-600">Calculate precise memory requirements for LLM inference and training</p>
          </Link>

          <Link href="/infrastructure" className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:border-purple-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Infra Directory</h3>
            <p className="text-slate-600">Analyze global datacenter availability and cluster scalability</p>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/hardware"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-red-500 text-red-600 font-bold text-lg rounded-xl hover:bg-red-50 hover:scale-105 transition-all"
            >
              Explore Specs
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Start Planning
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="text-slate-900 font-semibold mb-2">
            <span className="text-red-500">◆</span> AI Compute Planner
          </div>
          <div className="text-slate-500 mb-4">
            Infrastructure-grade tools for the next era of compute
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <span>R&D vibecoded project</span>
            <span>•</span>
            <span>Latest Update: Jan 22, 2026</span>
            <span>•</span>
            <span>Built with Next.js</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
