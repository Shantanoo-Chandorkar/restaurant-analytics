'use client'

import { useMemo } from 'react'
import { useDateRangeStore } from '@/store/useDateRangeStore'
import { useFilterStore } from '@/store/useFilterStore'
import { useRestaurants } from '@/hooks/useRestaurants'
import RestaurantCard from './RestaurantCard'
import { Input } from './ui/input'

const selectClass =
  'h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700'

export default function RestaurantDirectory() {
  const { startDate, endDate } = useDateRangeStore()
  const {
    search,
    sortBy,
    sortDirection,
    cuisine,
    location,
    setSearch,
    setSortBy,
    setSortDirection,
    setCuisine,
    setLocation,
  } = useFilterStore()

  const { data: restaurants, isLoading, isError } = useRestaurants({
    search,
    sortBy,
    sortDirection,
    cuisine,
    location,
  })

  const cuisines = useMemo(
    () => Array.from(new Set(restaurants?.map((r) => r.cuisine) ?? [])).sort(),
    [restaurants]
  )
  const locations = useMemo(
    () => Array.from(new Set(restaurants?.map((r) => r.location) ?? [])).sort(),
    [restaurants]
  )

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Directory</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={selectClass}
        >
          <option value="name">Sort: Name</option>
          <option value="cuisine">Sort: Cuisine</option>
          <option value="location">Sort: Location</option>
        </select>

        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
          className={selectClass}
        >
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>

        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className={selectClass}
        >
          <option value="">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={selectClass}
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-white rounded-xl border border-gray-200 animate-pulse" />
          ))}
        </div>
      )}
      {isError && <p className="text-sm text-red-500">Failed to load restaurants.</p>}
      {restaurants && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
          {restaurants.length === 0 && (
            <p className="col-span-4 text-sm text-gray-400 py-8 text-center">
              No restaurants found.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
