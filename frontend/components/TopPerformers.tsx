'use client'

import { useDateRangeStore } from '@/store/useDateRangeStore'
import { useTopRestaurants } from '@/hooks/useTopRestaurants'
import TopPerformerCard from './TopPerformerCard'

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 bg-amber-50 rounded-xl border border-amber-200 animate-pulse" />
      ))}
    </div>
  )
}

export default function TopPerformers() {
  const { startDate, endDate } = useDateRangeStore()
  const { data: restaurants, loading, error } = useTopRestaurants(startDate, endDate)

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Top Performers</h2>
      {loading && <Skeleton />}
      {error && (
        <p className="text-sm text-red-500">Failed to load top performers.</p>
      )}
      {restaurants && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {restaurants.map((restaurant, index) => (
            <TopPerformerCard
              key={restaurant.id}
              restaurant={restaurant}
              rank={index + 1}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
        </div>
      )}
    </section>
  )
}
