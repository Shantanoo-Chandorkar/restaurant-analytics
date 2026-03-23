'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDateRangeStore } from '@/store/useDateRangeStore'
import { useRestaurantSummary } from '@/hooks/useRestaurantSummary'
import { useAnalyticsDaily } from '@/hooks/useAnalyticsDaily'
import { apiFetch } from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import KpiCard from '@/components/KpiCard'
import Header from '@/components/Header'
import DailyBreakdownTable from '@/components/DailyBreakdownTable'
import DailyOrdersChart from '@/components/charts/DailyOrdersChart'
import DailyRevenueChart from '@/components/charts/DailyRevenueChart'
import AovChart from '@/components/charts/AovChart'
import PeakHourChart from '@/components/charts/PeakHourChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Restaurant } from '@/lib/types'

export default function RestaurantDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const { startDate, endDate } = useDateRangeStore()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  useEffect(() => {
    if (!id) return
    apiFetch<Restaurant>(`/restaurants/${id}`).then(setRestaurant).catch(() => null)
  }, [id])

  const { data: summary, loading: summaryLoading } = useRestaurantSummary(id, startDate, endDate)
  const { data: daily, loading: dailyLoading } = useAnalyticsDaily(id, startDate, endDate)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Back + Title */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            {restaurant?.name ?? 'Restaurant Detail'}
          </h2>
          {restaurant && (
            <p className="text-sm text-slate-500 mt-0.5">
              {restaurant.cuisine} · {restaurant.location}
            </p>
          )}
        </div>

        {/* KPI Cards */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <KpiCard
              icon="📦"
              label="Total Orders"
              value={String(summary.orders)}
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
            />
            <KpiCard
              icon="💰"
              label="Total Revenue"
              value={formatCurrency(summary.revenue)}
              colorClass="text-green-600"
              bgClass="bg-green-50"
            />
            <KpiCard
              icon="📊"
              label="Avg Order Value"
              value={formatCurrency(summary.aov)}
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
            />
          </div>
        ) : null}

        {/* Charts */}
        {dailyLoading ? (
          <div className="flex flex-col gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : daily && daily.length > 0 ? (
          <div className="flex flex-col gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Daily Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyOrdersChart data={daily} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyRevenueChart data={daily} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <AovChart data={daily} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Peak Hour by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <PeakHourChart data={daily} />
              </CardContent>
            </Card>
          </div>
        ) : !dailyLoading ? (
          <p className="text-sm text-slate-400 mb-8">No daily data for the selected date range.</p>
        ) : null}

        {/* Daily Breakdown Table */}
        {daily && daily.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Daily Breakdown</h3>
            <DailyBreakdownTable data={daily} />
          </div>
        )}
      </main>
    </div>
  )
}
