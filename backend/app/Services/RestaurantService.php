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
        $sortDir   = $this->validateSortDirection($filters['sort_direction'] ?? 'asc');
        $startDate = $filters['start_date'] ?? null;
        $endDate   = $filters['end_date'] ?? null;

        if ($startDate && $endDate) {
            $cacheKey = "restaurants:list:{$startDate}:{$endDate}:"
                . ($filters['search'] ?? '') . ':'
                . ($filters['cuisine'] ?? '') . ':'
                . ($filters['location'] ?? '') . ':'
                . $sortBy . ':' . $sortDir;

            return Cache::remember($cacheKey, 900, function () use ($filters, $sortBy, $sortDir, $startDate, $endDate) {
                $endOfDay = $this->endOfDay($endDate);

                $sub = DB::table('orders')
                    ->selectRaw('restaurant_id, COUNT(id) as sub_orders, SUM(order_amount) as sub_revenue, AVG(order_amount) as sub_aov')
                    ->whereBetween('order_time', [$startDate, $endOfDay])
                    ->groupBy('restaurant_id');

                return Restaurant::leftJoinSub($sub, 'order_stats', fn($join) =>
                        $join->on('order_stats.restaurant_id', '=', 'restaurants.id')
                    )
                    ->select('restaurants.*')
                    ->selectRaw('COALESCE(order_stats.sub_orders, 0) as summary_orders, COALESCE(order_stats.sub_revenue, 0) as summary_revenue, COALESCE(order_stats.sub_aov, 0) as summary_aov')
                    ->when($filters['search'] ?? null, fn($q, $v) => $q->where('restaurants.name', 'like', '%' . $v . '%'))
                    ->when($filters['cuisine'] ?? null, fn($q, $v) => $q->where('restaurants.cuisine', $v))
                    ->when($filters['location'] ?? null, fn($q, $v) => $q->where('restaurants.location', $v))
                    ->orderBy("restaurants.{$sortBy}", $sortDir)
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
            ->orderBy($sortBy, $sortDir)
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

    private function validateSortDirection(string $direction): string
    {
        return in_array(strtolower($direction), ['asc', 'desc']) ? strtolower($direction) : 'asc';
    }
}
