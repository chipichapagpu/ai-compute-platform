'use client'

import { useState } from 'react'

interface CodeBlockProps {
  title?: string
  language: string
  code: string
}

export default function CodeBlock({ title, language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {title && <span className="text-sm font-medium text-slate-700">{title}</span>}
          <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-slate-900 text-slate-100 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
