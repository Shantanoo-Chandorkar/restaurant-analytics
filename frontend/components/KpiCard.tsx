import { ReactNode } from 'react'
import { Card, CardContent } from './ui/card'

interface KpiCardProps {
  icon: ReactNode
  label: string
  value: string
  colorClass: string
  bgClass: string
}

export default function KpiCard({ icon, label, value, colorClass, bgClass }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${bgClass}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${colorClass}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
