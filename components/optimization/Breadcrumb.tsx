import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {i === items.length - 1 ? (
            <span className="text-slate-900 font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-red-600 transition-colors">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
