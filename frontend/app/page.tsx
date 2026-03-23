'use client'

import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import TopPerformers from '@/components/TopPerformers'
import RestaurantDirectory from '@/components/RestaurantDirectory'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <PageHeader title="Analytics" />
        <TopPerformers />
        <RestaurantDirectory />
      </main>
    </div>
  )
}
