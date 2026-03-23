'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDateRangeStore } from '@/store/useDateRangeStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { useRestaurantSummary } from '@/hooks/useRestaurantSummary'
import { useAnalyticsDaily } from '@/hooks/useAnalyticsDaily'
import { apiFetch } from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import { getComparisonDates, formatDateRange } from '@/lib/comparison'
import KpiCard from '@/components/KpiCard'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import DailyBreakdownTable from '@/components/DailyBreakdownTable'
import DailyOrdersChart from '@/components/charts/DailyOrdersChart'
import DailyRevenueChart from '@/components/charts/DailyRevenueChart'
import AovChart from '@/components/charts/AovChart'
import PeakHourChart from '@/components/charts/PeakHourChart'
import OrdersTable from '@/components/OrdersTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Restaurant } from '@/lib/types'

export default function RestaurantDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const { startDate, endDate } = useDateRangeStore()
  const { type: comparisonType } = useComparisonStore()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  useEffect(() => {
    if (!id) return
    apiFetch<Restaurant>(`/restaurants/${id}`).then(setRestaurant).catch(() => null)
  }, [id])

  const { data: summary, loading: summaryLoading } = useRestaurantSummary(id, startDate, endDate)
  const { data: daily, loading: dailyLoading } = useAnalyticsDaily(id, startDate, endDate)

  const compDates = getComparisonDates(startDate, endDate, comparisonType)
  const { data: compSummary } = useRestaurantSummary(
    compDates ? id : 0,
    compDates?.compStart ?? startDate,
    compDates?.compEnd ?? endDate
  )
  const { data: compDaily } = useAnalyticsDaily(
    compDates ? id : 0,
    compDates?.compStart ?? startDate,
    compDates?.compEnd ?? endDate
  )

  function delta(current: number, comparison: number): string {
    if (!comparison) return ''
    const pct = ((current - comparison) / comparison) * 100
    return (pct >= 0 ? '▲' : '▼') + Math.abs(pct).toFixed(1) + '%'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Back link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>
          {restaurant && (
            <p className="text-sm text-slate-500 mt-1">
              {restaurant.cuisine} · {restaurant.location}
            </p>
          )}
        </div>

        <PageHeader title={restaurant?.name ?? 'Restaurant Detail'} />

        {/* KPI Cards */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
              comparison={compSummary ? { value: String(compSummary.orders), delta: delta(summary.orders, compSummary.orders) } : undefined}
            />
            <KpiCard
              icon="💰"
              label="Total Revenue"
              value={formatCurrency(summary.revenue)}
              colorClass="text-green-600"
              bgClass="bg-green-50"
              comparison={compSummary ? { value: formatCurrency(compSummary.revenue), delta: delta(summary.revenue, compSummary.revenue) } : undefined}
            />
            <KpiCard
              icon="📊"
              label="Avg Order Value"
              value={formatCurrency(summary.aov)}
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
              comparison={compSummary ? { value: formatCurrency(compSummary.aov), delta: delta(summary.aov, compSummary.aov) } : undefined}
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
                <DailyOrdersChart data={daily} comparisonData={compDaily ?? undefined} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyRevenueChart data={daily} comparisonData={compDaily ?? undefined} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <AovChart data={daily} comparisonData={compDaily ?? undefined} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Peak Hour by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <PeakHourChart data={daily} comparisonData={compDaily ?? undefined} />
              </CardContent>
            </Card>
          </div>
        ) : !dailyLoading ? (
          <p className="text-sm text-slate-400 mb-8">No daily data for the selected date range.</p>
        ) : null}

        {/* Daily Breakdown Table */}
        {daily && daily.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Daily Breakdown</h3>
            <DailyBreakdownTable data={daily} />
          </div>
        )}

        {/* Orders Table */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Orders</h3>
          <OrdersTable restaurantId={id} startDate={startDate} endDate={endDate} />
        </div>
      </main>
    </div>
  )
}
