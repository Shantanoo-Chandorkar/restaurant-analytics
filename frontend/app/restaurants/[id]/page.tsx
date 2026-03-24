'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { CubeIcon, CurrencyDollarIcon, ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useDateRangeStore } from '@/store/useDateRangeStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { useRestaurantDetail } from '@/hooks/useRestaurantDetail'
import { useRestaurantSummary } from '@/hooks/useRestaurantSummary'
import { useAnalyticsDaily } from '@/hooks/useAnalyticsDaily'
import { useTopDays } from '@/hooks/useTopDays'
import { formatCurrency, generateDateRange } from '@/lib/format'
import { getComparisonDates } from '@/lib/comparison'
import KpiCard from '@/components/KpiCard'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import TopDaysTable from '@/components/TopDaysTable'
import DailyOrdersChart from '@/components/charts/DailyOrdersChart'
import DailyRevenueChart from '@/components/charts/DailyRevenueChart'
import AovChart from '@/components/charts/AovChart'
import PeakHourChart from '@/components/charts/PeakHourChart'
import OrdersTable from '@/components/OrdersTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ChartTab = 'orders' | 'revenue' | 'aov' | 'peak_hour'

const CHART_TABS: { id: ChartTab; label: string }[] = [
  { id: 'orders', label: 'Daily Orders' },
  { id: 'revenue', label: 'Daily Revenue' },
  { id: 'aov', label: 'Avg Order Value' },
  { id: 'peak_hour', label: 'Peak Hour' },
]

export default function RestaurantDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const { startDate, endDate } = useDateRangeStore()
  const { type: comparisonType } = useComparisonStore()
  const [activeTab, setActiveTab] = useState<ChartTab>('orders')

  const { restaurant, summary, loading: detailLoading } = useRestaurantDetail(id, startDate, endDate)
  const { data: daily } = useAnalyticsDaily(id, startDate, endDate)
  const { data: topDays } = useTopDays(id, startDate, endDate)

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
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </Link>
          {restaurant && (
            <p className="text-sm text-slate-500 mt-1">
              {restaurant.cuisine} · {restaurant.location}
            </p>
          )}
        </div>

        <PageHeader title={restaurant?.name ?? 'Restaurant Detail'} />

        {/* KPI Cards */}
        {detailLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <KpiCard
              icon={<CubeIcon className="w-6 h-6 text-blue-600" />}
              label="Total Orders"
              value={String(summary.orders)}
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
              comparison={compSummary ? { value: String(compSummary.orders), delta: delta(summary.orders, compSummary.orders) } : undefined}
            />
            <KpiCard
              icon={<CurrencyDollarIcon className="w-6 h-6 text-green-600" />}
              label="Total Revenue"
              value={formatCurrency(summary.revenue)}
              colorClass="text-green-600"
              bgClass="bg-green-50"
              comparison={compSummary ? { value: formatCurrency(compSummary.revenue), delta: delta(summary.revenue, compSummary.revenue) } : undefined}
            />
            <KpiCard
              icon={<ChartBarIcon className="w-6 h-6 text-purple-600" />}
              label="Avg Order Value"
              value={formatCurrency(summary.aov)}
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
              comparison={compSummary ? { value: formatCurrency(compSummary.aov), delta: delta(summary.aov, compSummary.aov) } : undefined}
            />
          </div>
        ) : null}

        {/* Charts — always rendered; empty axes when no data */}
        <div className="mb-8">
          <div className="flex gap-1 mb-4 border-b border-slate-200">
            {CHART_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white border border-b-white border-slate-200 text-blue-600 -mb-px'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{CHART_TABS.find(t => t.id === activeTab)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'orders' && (
                <DailyOrdersChart data={daily ?? generateDateRange(startDate, endDate)} comparisonData={compDaily ?? undefined} />
              )}
              {activeTab === 'revenue' && (
                <DailyRevenueChart data={daily ?? generateDateRange(startDate, endDate)} comparisonData={compDaily ?? undefined} />
              )}
              {activeTab === 'aov' && (
                <AovChart data={daily ?? generateDateRange(startDate, endDate)} comparisonData={compDaily ?? undefined} />
              )}
              {activeTab === 'peak_hour' && (
                <PeakHourChart data={daily ?? generateDateRange(startDate, endDate)} comparisonData={compDaily ?? undefined} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Days */}
        {topDays && topDays.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Top Performing Days</h3>
            <TopDaysTable data={topDays} />
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
