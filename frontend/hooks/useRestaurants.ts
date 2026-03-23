import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { Restaurant } from '@/lib/types'

interface RestaurantFilters {
  search?: string
  sortBy?: string
  sortDirection?: string
  cuisine?: string
  location?: string
}

export function useRestaurants(filters: RestaurantFilters = {}) {
  const [data, setData] = useState<Restaurant[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params: Record<string, string> = {}
    if (filters.search) params.search = filters.search
    if (filters.sortBy) params.sort_by = filters.sortBy
    if (filters.sortDirection) params.sort_direction = filters.sortDirection
    if (filters.cuisine) params.cuisine = filters.cuisine
    if (filters.location) params.location = filters.location

    apiFetch<Restaurant[]>('/restaurants', params)
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [filters.search, filters.sortBy, filters.sortDirection, filters.cuisine, filters.location])

  return { data, loading, error }
}
