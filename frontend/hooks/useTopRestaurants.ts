import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { TopRestaurant } from '@/lib/types'

export function useTopRestaurants(startDate: string, endDate: string, limit = 3) {
  const [data, setData] = useState<TopRestaurant[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    apiFetch<TopRestaurant[]>('/restaurants/top', {
      start_date: startDate,
      end_date: endDate,
      limit: String(limit),
    })
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [startDate, endDate, limit])

  return { data, loading, error }
}
