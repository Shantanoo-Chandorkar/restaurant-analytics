import Header from '@/components/Header'
import TopPerformers from '@/components/TopPerformers'
import RestaurantDirectory from '@/components/RestaurantDirectory'

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <TopPerformers />
        <RestaurantDirectory />
      </main>
    </div>
  )
}
