import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { RestaurantWithSummary } from '@/lib/types'

interface RestaurantFilters {
  search?: string
  sortBy?: string
  sortDirection?: string
  cuisine?: string
  location?: string
  startDate?: string
  endDate?: string
}

export function useRestaurants(filters: RestaurantFilters = {}) {
  const [data, setData] = useState<RestaurantWithSummary[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setData(null)
    setLoading(true)
    const params: Record<string, string> = {}
    if (filters.search) params.search = filters.search
    if (filters.sortBy) params.sort_by = filters.sortBy
    if (filters.sortDirection) params.sort_direction = filters.sortDirection
    if (filters.cuisine) params.cuisine = filters.cuisine
    if (filters.location) params.location = filters.location
    if (filters.startDate) params.start_date = filters.startDate
    if (filters.endDate) params.end_date = filters.endDate

    apiFetch<RestaurantWithSummary[]>('/restaurants', params)
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [filters.search, filters.sortBy, filters.sortDirection, filters.cuisine, filters.location, filters.startDate, filters.endDate])

  return { data, loading, error }
}
