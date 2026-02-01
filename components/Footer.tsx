import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Computenomics. All rights reserved.
          </div>
          <nav className="flex gap-6 text-sm text-slate-500">
            <Link href="/calculator" className="hover:text-slate-900">Calculator</Link>
            <Link href="/optimization" className="hover:text-slate-900">Optimization</Link>
            <Link href="/hardware" className="hover:text-slate-900">Hardware</Link>
            <Link href="/infrastructure" className="hover:text-slate-900">Infrastructure</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
