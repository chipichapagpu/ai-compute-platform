interface TLDRBoxProps {
  summary: string
  useWhen?: string[]
  skipWhen?: string[]
}

export default function TLDRBox({ summary, useWhen, skipWhen }: TLDRBoxProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
      <p className="text-blue-900 mb-4">{summary}</p>

      {(useWhen || skipWhen) && (
        <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
          {useWhen && useWhen.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-green-700 mb-2">Use when</h4>
              <ul className="space-y-1">
                {useWhen.map((item, i) => (
                  <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {skipWhen && skipWhen.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-700 mb-2">Skip when</h4>
              <ul className="space-y-1">
                {skipWhen.map((item, i) => (
                  <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
