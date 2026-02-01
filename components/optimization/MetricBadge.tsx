interface MetricBadgeProps {
  label: string
  value: string
  variant?: 'green' | 'blue' | 'purple'
}

const variants = {
  green: 'bg-green-50 text-green-700 border-green-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200'
}

export default function MetricBadge({ label, value, variant = 'green' }: MetricBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm ${variants[variant]}`}>
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  )
}
