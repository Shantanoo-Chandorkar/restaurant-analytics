import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { DailyRow } from '@/lib/types'

export function useAnalyticsDaily(
  restaurantId: number,
  startDate: string,
  endDate: string
) {
  const [data, setData] = useState<DailyRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!restaurantId) return
    let cancelled = false
    setLoading(true)
    apiFetch<DailyRow[]>(`/analytics/${restaurantId}/daily`, {
      start_date: startDate,
      end_date: endDate,
    })
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [restaurantId, startDate, endDate])

  return { data, loading, error }
}
