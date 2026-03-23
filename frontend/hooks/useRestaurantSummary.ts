import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Summary } from '@/lib/types'

export function useRestaurantSummary(
  restaurantId: number,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ['analytics', restaurantId, 'summary', startDate, endDate],
    queryFn: () =>
      apiFetch<Summary>(`/analytics/${restaurantId}/summary`, {
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!restaurantId,
  })
}
