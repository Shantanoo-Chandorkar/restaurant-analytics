<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Restaurant;

class RestaurantService {

    /**
     * Returns all restaurants with optional search, sort, and filters.
     */
    public function getRestaurants(array $filters = []): array
    {
        $sortBy = $this->validateSortBy($filters['sort_by'] ?? 'name');

        return Restaurant::when($filters['search'] ?? null, fn($q, $v) => $q->where('name', 'like', '%' . $v . '%'))
            ->when($filters['cuisine'] ?? null, fn($q, $v) => $q->where('cuisine', $v))
            ->when($filters['location'] ?? null, fn($q, $v) => $q->where('location', $v))
            ->orderBy($sortBy, $filters['sort_direction'] ?? 'asc')
            ->get()
            ->toArray();
    }

    /**
     * Returns top N restaurants by total revenue within a date range.
     */
    public function getTopByRevenue(string $startDate, string $endDate, int $limit = 3): array
    {
        return Restaurant::join('orders', 'restaurants.id', '=', 'orders.restaurant_id')
            ->selectRaw('restaurants.*, SUM(orders.order_amount) as total_revenue')
            ->whereBetween('orders.order_time', [$startDate, $endDate])
            ->groupBy('restaurants.id')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Validates sort column against whitelist to prevent column injection.
     */
    private function validateSortBy(string $sortBy): string
    {
        $allowedSorts = ['name', 'cuisine', 'location'];
        return in_array($sortBy, $allowedSorts) ? $sortBy : 'name';
    }
}