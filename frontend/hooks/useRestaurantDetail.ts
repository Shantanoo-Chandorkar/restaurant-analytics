import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { Restaurant, Summary } from '@/lib/types'

interface RestaurantDetailResponse extends Restaurant {
  summary: Summary
}

export function useRestaurantDetail(id: number, startDate: string, endDate: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    apiFetch<RestaurantDetailResponse>(`/restaurants/${id}`, { start_date: startDate, end_date: endDate })
      .then(d => {
        if (!cancelled) {
          const { summary, ...rest } = d
          setRestaurant(rest as Restaurant)
          setSummary(summary)
          setLoading(false)
        }
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id, startDate, endDate])

  return { restaurant, summary, loading }
}
