import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { TopDay } from '@/lib/types'

export function useTopDays(
  restaurantId: number,
  startDate: string,
  endDate: string,
  limit = 5
) {
  const [data, setData] = useState<TopDay[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!restaurantId) return
    let cancelled = false
    setLoading(true)
    apiFetch<TopDay[]>(`/analytics/${restaurantId}/top-days`, {
      start_date: startDate,
      end_date: endDate,
      limit: String(limit),
    })
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [restaurantId, startDate, endDate, limit])

  return { data, loading, error }
}
