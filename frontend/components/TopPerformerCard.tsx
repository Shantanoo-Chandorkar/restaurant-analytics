'use client'

import { Badge } from './ui/badge'
import { useRestaurantSummary } from '@/hooks/useRestaurantSummary'
import { formatCurrencyShort } from '@/lib/format'
import type { TopRestaurant } from '@/lib/types'

const RANK_STYLES: Record<number, { badge: string; label: string }> = {
  1: { badge: 'bg-yellow-400 text-yellow-900', label: '🥇 1st' },
  2: { badge: 'bg-gray-300 text-gray-700', label: '🥈 2nd' },
  3: { badge: 'bg-orange-400 text-orange-900', label: '🥉 3rd' },
}

interface Props {
  restaurant: TopRestaurant
  rank: number
  startDate: string
  endDate: string
}

export default function TopPerformerCard({ restaurant, rank, startDate, endDate }: Props) {
  const { data: summary } = useRestaurantSummary(restaurant.id, startDate, endDate)
  const rankStyle = RANK_STYLES[rank] ?? { badge: 'bg-gray-200 text-gray-600', label: `#${rank}` }

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Badge className={rankStyle.badge}>{rankStyle.label}</Badge>
      </div>

      <div>
        <p className="text-lg font-bold text-slate-900">{restaurant.name}</p>
        <p className="text-sm text-slate-500 mt-0.5">
          {restaurant.cuisine} · {restaurant.location}
        </p>
      </div>

      <div className="flex gap-4 pt-1 border-t border-amber-200">
        <div>
          <p className="text-xs text-slate-500">Revenue</p>
          <p className="text-base font-bold text-green-700">
            {formatCurrencyShort(restaurant.total_revenue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Orders</p>
          <p className="text-base font-bold text-blue-700">
            {summary ? summary.orders : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
