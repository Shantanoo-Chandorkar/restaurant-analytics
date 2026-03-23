export interface Restaurant {
  id: number
  name: string
  cuisine: string
  location: string
}

export interface TopRestaurant extends Restaurant {
  total_revenue: number
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
