'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header({ maxWidth = 'max-w-7xl' }: { maxWidth?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className={`${maxWidth} mx-auto px-6 py-6`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">◆</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Computenomics</h1>
              <p className="text-sm text-slate-500 hidden sm:block">Compute economics for AI infrastructure</p>
            </div>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/hardware" className="hover:text-slate-900">GPUs</Link>
            <Link href="/calculator" className="hover:text-slate-900">Estimate VRAM</Link>
            <Link href="/infrastructure" className="hover:text-slate-900">Compute Insights</Link>
          </nav>
          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 -mr-2" aria-label="Menu">
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col gap-3 text-sm text-slate-600 border-t border-slate-100 mt-4">
            <Link href="/hardware" onClick={() => setOpen(false)} className="hover:text-slate-900 py-2">GPUs</Link>
            <Link href="/calculator" onClick={() => setOpen(false)} className="hover:text-slate-900 py-2">Estimate VRAM</Link>
            <Link href="/infrastructure" onClick={() => setOpen(false)} className="hover:text-slate-900 py-2">Compute Insights</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
