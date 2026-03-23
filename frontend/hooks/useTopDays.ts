import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { TopDay } from '@/lib/types'

export function useTopDays(
  restaurantId: number,
  startDate: string,
  endDate: string,
  limit = 5
) {
  return useQuery({
    queryKey: ['analytics', restaurantId, 'top-days', startDate, endDate, limit],
    queryFn: () =>
      apiFetch<TopDay[]>(`/analytics/${restaurantId}/top-days`, {
        start_date: startDate,
        end_date: endDate,
        limit: String(limit),
      }),
    enabled: !!restaurantId,
  })
}
