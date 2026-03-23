export interface Restaurant {
  id: number
  name: string
  cuisine: string
  location: string
}

export interface RestaurantWithSummary extends Restaurant {
  summary?: Summary
}

export interface TopRestaurant extends Restaurant {
  total_revenue: number
  orders: number
  aov: number
}

export interface Summary {
  revenue: number
  orders: number
  aov: number
}

export interface DailyRow {
  date: string
  orders: number
  revenue: number
  aov: number
  peak_hour: number | null
}

export interface TopDay {
  date: string
  orders: number
  revenue: number
  aov: number
}

export interface OrderRow {
  id: number
  order_time: string
  order_amount: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  per_page: number
  current_page: number
  last_page: number
}
