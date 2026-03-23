import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { TopRestaurant } from '@/lib/types'

export function useTopRestaurants(startDate: string, endDate: string, limit = 3) {
  return useQuery({
    queryKey: ['restaurants', 'top', startDate, endDate, limit],
    queryFn: () =>
      apiFetch<TopRestaurant[]>('/restaurants/top', {
        start_date: startDate,
        end_date: endDate,
        limit: String(limit),
      }),
  })
}
