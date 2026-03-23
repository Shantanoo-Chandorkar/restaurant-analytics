import { useQuery } from '@tanstack/react-query'
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
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => {
      const params: Record<string, string> = {}
      if (filters.search) params.search = filters.search
      if (filters.sortBy) params.sort_by = filters.sortBy
      if (filters.sortDirection) params.sort_direction = filters.sortDirection
      if (filters.cuisine) params.cuisine = filters.cuisine
      if (filters.location) params.location = filters.location
      return apiFetch<Restaurant[]>('/restaurants', params)
    },
  })
}
