import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { DailyRow } from '@/lib/types'

export function useAnalyticsDaily(
  restaurantId: number,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ['analytics', restaurantId, 'daily', startDate, endDate],
    queryFn: () =>
      apiFetch<DailyRow[]>(`/analytics/${restaurantId}/daily`, {
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!restaurantId,
  })
}
