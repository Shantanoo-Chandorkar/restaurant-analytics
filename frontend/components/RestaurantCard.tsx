'use client'

import Link from 'next/link'
import { formatCurrencyShort } from '@/lib/format'
import type { Restaurant, Summary } from '@/lib/types'

interface Props {
  restaurant: Restaurant
  summary?: Summary
}

export default function RestaurantCard({ restaurant, summary }: Props) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
        <div className="mb-3">
          <p className="font-bold text-slate-900 text-base">{restaurant.name}</p>
          <p className="text-sm text-slate-500 mt-0.5">
            {restaurant.cuisine} · {restaurant.location}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3 flex gap-4">
          <div>
            <p className="text-xs text-slate-400">Orders</p>
            <p className="text-sm font-bold text-blue-600">{summary?.orders ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Revenue</p>
            <p className="text-sm font-bold text-green-600">
              {summary ? formatCurrencyShort(summary.revenue) : formatCurrencyShort(0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">AOV</p>
            <p className="text-sm font-bold text-purple-600">
              {summary ? formatCurrencyShort(summary.aov) : formatCurrencyShort(0)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
