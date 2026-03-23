import { ReactNode } from 'react'
import { Card, CardContent } from './ui/card'

interface KpiCardProps {
  icon: ReactNode
  label: string
  value: string
  colorClass: string
  bgClass: string
  comparison?: { value: string; delta: string }
}

export default function KpiCard({ icon, label, value, colorClass, bgClass, comparison }: KpiCardProps) {
  const isPositive = comparison?.delta.startsWith('▲')

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${bgClass}`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${colorClass}`}>{value}</p>
            {comparison && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{comparison.value}</span>
                <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {comparison.delta}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
