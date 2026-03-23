import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import type { Restaurant } from '@/lib/types'

interface RestaurantsMeta {
  cuisines: string[]
  locations: string[]
}

export function useRestaurantsMeta(): RestaurantsMeta {
  const [cuisines, setCuisines] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    apiFetch<Restaurant[]>('/restaurants').then((data) => {
      setCuisines(Array.from(new Set(data.map((r) => r.cuisine))).sort())
      setLocations(Array.from(new Set(data.map((r) => r.location))).sort())
    }).catch(() => null)
  }, [])

  return { cuisines, locations }
}
