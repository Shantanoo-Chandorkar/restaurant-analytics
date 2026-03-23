'use client'

import { useDateRangeStore } from '@/store/useDateRangeStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { useTopRestaurants } from '@/hooks/useTopRestaurants'
import { getComparisonDates, formatDateRange } from '@/lib/comparison'
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

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
      <p className="text-sm text-slate-400">No top performers for the selected date range.</p>
    </div>
  )
}

export default function TopPerformers() {
  const { startDate, endDate } = useDateRangeStore()
  const { type: comparisonType } = useComparisonStore()
  const { data: restaurants, loading, error } = useTopRestaurants(startDate, endDate)

  const compDates = getComparisonDates(startDate, endDate, comparisonType)
  const { data: compRestaurants, loading: compLoading } = useTopRestaurants(
    compDates?.compStart ?? startDate,
    compDates?.compEnd ?? endDate
  )

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Top Performers</h2>

      {loading && <Skeleton />}
      {!loading && error && (
        <p className="text-sm text-red-500">Failed to load top performers.</p>
      )}
      {!loading && !error && restaurants && restaurants.length === 0 && <EmptyState />}
      {!loading && !error && restaurants && restaurants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {restaurants.map((restaurant, index) => (
            <TopPerformerCard key={restaurant.id} restaurant={restaurant} rank={index + 1} />
          ))}
        </div>
      )}

      {compDates && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap">
              Comparison: {formatDateRange(compDates.compStart, compDates.compEnd)}
            </p>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          {compLoading && <Skeleton />}
          {!compLoading && compRestaurants && compRestaurants.length === 0 && <EmptyState />}
          {!compLoading && compRestaurants && compRestaurants.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {compRestaurants.map((restaurant, index) => (
                <TopPerformerCard key={restaurant.id} restaurant={restaurant} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
