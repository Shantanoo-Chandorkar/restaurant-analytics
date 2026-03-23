import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { Summary } from '@/lib/types'

export function useRestaurantSummary(
  restaurantId: number,
  startDate: string,
  endDate: string
) {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!restaurantId) return
    let cancelled = false
    setLoading(true)
    apiFetch<Summary>(`/analytics/${restaurantId}/summary`, {
      start_date: startDate,
      end_date: endDate,
    })
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [restaurantId, startDate, endDate])

  return { data, loading, error }
}
