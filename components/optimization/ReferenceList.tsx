interface Reference {
  title: string
  url: string
  type: 'paper' | 'repo' | 'docs'
}

interface ReferenceListProps {
  references: Reference[]
}

const typeIcons = {
  paper: '📄',
  repo: '💻',
  docs: '📖'
}

const typeLabels = {
  paper: 'Paper',
  repo: 'Repository',
  docs: 'Documentation'
}

export default function ReferenceList({ references }: ReferenceListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">References</h3>
      <ul className="space-y-2">
        {references.map((ref, i) => (
          <li key={i}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors group"
            >
              <span className="text-lg">{typeIcons[ref.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 group-hover:text-red-600 truncate">
                  {ref.title}
                </div>
                <div className="text-xs text-slate-500">{typeLabels[ref.type]}</div>
              </div>
              <svg className="w-4 h-4 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
