import Link from 'next/link'
import { Technique } from '@/data/optimization-techniques'
import MetricBadge from './MetricBadge'

interface TechniqueCardProps {
  technique: Technique
  showCategory?: boolean
}

const hardwareLabels: Record<string, string> = {
  nvidia: 'NVIDIA',
  amd: 'AMD',
  apple: 'Apple',
  cpu: 'CPU'
}

export default function TechniqueCard({ technique, showCategory }: TechniqueCardProps) {
  return (
    <Link
      href={`/optimization/${technique.category}/${technique.slug}`}
      className="block p-5 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-sm transition-all bg-white group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
          {technique.title}
        </h3>
        {showCategory && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
            {technique.category}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{technique.summary}</p>

      {technique.metrics && (
        <div className="flex flex-wrap gap-2 mb-3">
          {technique.metrics.vramReduction && (
            <MetricBadge label="VRAM" value={technique.metrics.vramReduction} variant="green" />
          )}
          {technique.metrics.speedup && (
            <MetricBadge label="Speed" value={technique.metrics.speedup} variant="blue" />
          )}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        {technique.hardware.slice(0, 3).map(hw => (
          <span key={hw} className="px-1.5 py-0.5 rounded bg-slate-100">
            {hardwareLabels[hw] || hw}
          </span>
        ))}
        {technique.hardware.length > 3 && (
          <span className="text-slate-400">+{technique.hardware.length - 3}</span>
        )}
      </div>
    </Link>
  )
}
