<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Restaurant;

class RestaurantService {

    /**
     * Returns all restaurants with optional search, sort, and filters.
     * When start_date and end_date are provided, embeds a summary (orders, revenue, aov)
     * per restaurant via a single LEFT JOIN + GROUP BY — eliminating N+1 API calls.
     * Cached for 15 min when date params are present; not cached otherwise (filter variance).
     */
    public function getRestaurants(array $filters = []): array
    {
        $sortBy    = $this->validateSortBy($filters['sort_by'] ?? 'name');
        $startDate = $filters['start_date'] ?? null;
        $endDate   = $filters['end_date'] ?? null;

        if ($startDate && $endDate) {
            $cacheKey = "restaurants:list:{$startDate}:{$endDate}:"
                . ($filters['search'] ?? '') . ':'
                . ($filters['cuisine'] ?? '') . ':'
                . ($filters['location'] ?? '') . ':'
                . $sortBy . ':' . ($filters['sort_direction'] ?? 'asc');

            return Cache::remember($cacheKey, 900, function () use ($filters, $sortBy, $startDate, $endDate) {
                $endOfDay = $this->endOfDay($endDate);

                return Restaurant::leftJoin('orders', function ($join) use ($startDate, $endOfDay) {
                        $join->on('orders.restaurant_id', '=', 'restaurants.id')
                             ->whereBetween('orders.order_time', [$startDate, $endOfDay]);
                    })
                    ->select('restaurants.*')
                    ->selectRaw('COUNT(orders.id) as summary_orders, COALESCE(SUM(orders.order_amount), 0) as summary_revenue, COALESCE(AVG(orders.order_amount), 0) as summary_aov')
                    ->when($filters['search'] ?? null, fn($q, $v) => $q->where('restaurants.name', 'like', '%' . $v . '%'))
                    ->when($filters['cuisine'] ?? null, fn($q, $v) => $q->where('restaurants.cuisine', $v))
                    ->when($filters['location'] ?? null, fn($q, $v) => $q->where('restaurants.location', $v))
                    ->groupBy('restaurants.id')
                    ->orderBy("restaurants.{$sortBy}", $filters['sort_direction'] ?? 'asc')
                    ->get()
                    ->map(fn($r) => array_merge($r->toArray(), [
                        'summary' => [
                            'orders'  => (int) $r->summary_orders,
                            'revenue' => (float) $r->summary_revenue,
                            'aov'     => (float) $r->summary_aov,
                        ],
                    ]))
                    ->toArray();
            });
        }

        return Restaurant::when($filters['search'] ?? null, fn($q, $v) => $q->where('name', 'like', '%' . $v . '%'))
            ->when($filters['cuisine'] ?? null, fn($q, $v) => $q->where('cuisine', $v))
            ->when($filters['location'] ?? null, fn($q, $v) => $q->where('location', $v))
            ->orderBy($sortBy, $filters['sort_direction'] ?? 'asc')
            ->get()
            ->toArray();
    }

    /**
     * Returns top N restaurants by total revenue within a date range.
     * TTL: 1 hour. Revenue rankings shift slowly; join + aggregation makes this the
     * most expensive query in RestaurantService.
     */
    public function getTopByRevenue(string $startDate, string $endDate, int $limit = 3): array
    {
        return Cache::remember(
            "restaurants:top:{$startDate}:{$endDate}:{$limit}",
            3600,
            fn() => Restaurant::join('orders', 'restaurants.id', '=', 'orders.restaurant_id')
                ->selectRaw('restaurants.*, SUM(orders.order_amount) as total_revenue, COUNT(orders.id) as orders, AVG(orders.order_amount) as aov')
                ->whereBetween('orders.order_time', [$startDate, $this->endOfDay($endDate)])
                ->groupBy('restaurants.id')
                ->orderByDesc('total_revenue')
                ->limit($limit)
                ->get()
                ->toArray()
        );
    }

    /**
     * Appends 23:59:59 to a date string so whereBetween includes the full end day.
     */
    private function endOfDay(string $date): string
    {
        return $date . ' 23:59:59';
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
