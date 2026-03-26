import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { OrderRow, PaginatedResponse } from '@/lib/types'

export function useOrders(
  restaurantId: number,
  startDate: string,
  endDate: string,
  page: number,
  perPage = 15,
  minAmount = 100,
  maxAmount = 10000,
  minHour = 0,
  maxHour = 23
) {
  const [data, setData] = useState<PaginatedResponse<OrderRow> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!restaurantId) return
    let cancelled = false
    setLoading(true)
    apiFetch<PaginatedResponse<OrderRow>>(`/analytics/${restaurantId}/orders`, {
      start_date: startDate,
      end_date: endDate,
      page: String(page),
      per_page: String(perPage),
      min_amount: String(minAmount),
      max_amount: String(maxAmount),
      min_hour: String(minHour),
      max_hour: String(maxHour),
    })
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [restaurantId, startDate, endDate, page, perPage, minAmount, maxAmount, minHour, maxHour])

  return { data, loading, error }
}
