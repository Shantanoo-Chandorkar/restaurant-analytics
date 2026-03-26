<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Restaurant;

class AnalyticsService
{

    // ============ Total Analytics Start =============

    /**
     * Total revenue for a restaurant within a date range.
     * TTL: 15 min normally, 5 min during peak hours.
     */
    public function revenueForDateRange(int $restaurantId, string $startDate, string $endDate): float
    {
        return Cache::remember(
            "analytics:revenue:{$restaurantId}:{$startDate}:{$endDate}",
            $this->summaryTtl(),
            fn() => Restaurant::findOrFail($restaurantId)
                ->orders()
                ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
                ->sum('order_amount')
        );
    }

    /**
     * Total order count for a restaurant within a date range.
     * TTL: 15 min normally, 5 min during peak hours.
     */
    public function orderCountForDateRange(int $restaurantId, string $startDate, string $endDate): int
    {
        return Cache::remember(
            "analytics:order_count:{$restaurantId}:{$startDate}:{$endDate}",
            $this->summaryTtl(),
            fn() => Restaurant::findOrFail($restaurantId)
                ->orders()
                ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
                ->count()
        );
    }

    /**
     * Average order value (AOV) for a restaurant within a date range.
     * TTL: 15 min normally, 5 min during peak hours.
     */
    public function averageOrderValueForDateRange(int $restaurantId, string $startDate, string $endDate): float
    {
        return Cache::remember(
            "analytics:aov:{$restaurantId}:{$startDate}:{$endDate}",
            $this->summaryTtl(),
            fn() => Restaurant::findOrFail($restaurantId)
                ->orders()
                ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
                ->avg('order_amount') ?? 0
        );
    }

    /**
     * Total revenue, order count, and AOV for a restaurant within a date range.
     * Single query replaces the three separate calls. Cached with unified key.
     * TTL: 15 min normally, 5 min during peak hours.
     */
    public function getSummary(int $restaurantId, string $startDate, string $endDate): array
    {
        return Cache::remember(
            "analytics:summary:{$restaurantId}:{$startDate}:{$endDate}",
            $this->summaryTtl(),
            function () use ($restaurantId, $startDate, $endDate) {
                $row = Restaurant::findOrFail($restaurantId)
                    ->orders()
                    ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
                    ->selectRaw('COUNT(*) as orders, SUM(order_amount) as revenue, AVG(order_amount) as aov')
                    ->first();

                return [
                    'orders'  => (int) ($row->orders ?? 0),
                    'revenue' => (float) ($row->revenue ?? 0),
                    'aov'     => (float) ($row->aov ?? 0),
                ];
            }
        );
    }

    /**
     * Returns the hour (0-23) with the highest order volume for a restaurant on a given date.
     * Returns 0 if no orders found.
     * TTL: 30 min. Hour-level granularity makes 30 min staleness acceptable.
     */
    public function getPeakOrderHour(int $restaurantId, string $date): int
    {
        return Cache::remember(
            "analytics:peak_hour:{$restaurantId}:{$date}",
            1800,
            function () use ($restaurantId, $date) {
                $result = DB::table('orders')
                    ->selectRaw('HOUR(order_time) as hour, COUNT(*) as total')
                    ->where('restaurant_id', $restaurantId)
                    ->whereDate('order_time', $date)
                    ->groupBy('hour')
                    ->orderByDesc('total')
                    ->first();

                return $result ? $result->hour : 0;
            }
        );
    }

    // ============ Total Analytics End =============


    // ============ Per Day Analytics Start =============

    /**
     * Orders per day for a restaurant within a date range.
     * Returns: [['date' => '2025-06-22', 'value' => 12], ...]
     */
    public function ordersPerDay(int $restaurantId, string $startDate, string $endDate): array
    {
        return DB::table('orders')
            ->selectRaw('DATE(order_time) as date, COUNT(*) as value')
            ->where('restaurant_id', $restaurantId)
            ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    /**
     * Revenue per day for a restaurant within a date range.
     * Returns: [['date' => '2025-06-22', 'value' => 4500.00], ...]
     */
    public function revenuePerDay(int $restaurantId, string $startDate, string $endDate): array
    {
        return DB::table('orders')
            ->selectRaw('DATE(order_time) as date, SUM(order_amount) as value')
            ->where('restaurant_id', $restaurantId)
            ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    /**
     * AOV per day for a restaurant within a date range.
     * Returns: [['date' => '2025-06-22', 'value' => 375.00], ...]
     */
    public function aovPerDay(int $restaurantId, string $startDate, string $endDate): array
    {
        return DB::table('orders')
            ->selectRaw('DATE(order_time) as date, AVG(order_amount) as value')
            ->where('restaurant_id', $restaurantId)
            ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    /**
     * Peak order hour per day for a restaurant within a date range.
     * Fetches all hour counts per day, then picks the busiest hour in PHP.
     * Returns: [['date' => '2025-06-22', 'value' => 14], ...] (value = hour in 0-23)
     */
    public function peakHourPerDay(int $restaurantId, string $startDate, string $endDate): array
    {
        $rows = DB::table('orders')
            ->selectRaw('DATE(order_time) as date, HOUR(order_time) as hour, COUNT(*) as total')
            ->where('restaurant_id', $restaurantId)
            ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
            ->groupBy('date', 'hour')
            ->orderBy('date')
            ->get();

        return $rows->groupBy('date')
            ->map(fn($hours) => [
                'date'  => $hours->first()->date,
                'value' => $hours->sortByDesc('total')->first()->hour,
            ])
            ->values()
            ->toArray();
    }

    // ============ Per Day Analytics End =============


    // ============ Extra Analytics Start =============

    /**
     * Checks if the current hour falls within the average peak hour for a restaurant.
     * Averages the peak hour across all days in the date range, then compares to now().
     * Not cached. Must always reflect the current time.
     */
    public function isCurrentlyPeakHour(int $restaurantId, string $startDate, string $endDate): bool
    {
        $rows = DB::table('orders')
            ->selectRaw('DATE(order_time) as date, HOUR(order_time) as hour, COUNT(*) as total')
            ->where('restaurant_id', $restaurantId)
            ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
            ->groupBy('date', 'hour')
            ->get();

        if ($rows->isEmpty()) {
            return false;
        }

        // Get the peak hour for each day, then average them
        $avgPeakHour = (int) round(
            $rows->groupBy('date')
                ->map(fn($hours) => $hours->sortByDesc('total')->first()->hour)
                ->avg()
        );

        return now()->hour === $avgPeakHour;
    }

    /**
     * Combined daily breakdown for a restaurant within a date range.
     * Returns one row per day with orders, revenue, AOV, and peak hour merged.
     * TTL: 30 min. Only today's row changes; historical days are immutable.
     */
    public function getDailyBreakdown(int $restaurantId, string $startDate, string $endDate): array
    {
        return Cache::remember(
            "analytics:daily_breakdown:{$restaurantId}:{$startDate}:{$endDate}",
            1800,
            function () use ($restaurantId, $startDate, $endDate) {
                $orders   = $this->ordersPerDay($restaurantId, $startDate, $endDate);
                $revenue  = $this->revenuePerDay($restaurantId, $startDate, $endDate);
                $aov      = $this->aovPerDay($restaurantId, $startDate, $endDate);
                $peakHour = $this->peakHourPerDay($restaurantId, $startDate, $endDate);

                $result = [];

                foreach ($orders as $i => $order) {
                    $date = $order->date;
                    $result[$date] = [
                        'date'      => $date,
                        'orders'    => $order->value,
                        'revenue'   => $revenue[$i]->value ?? 0,
                        'aov'       => $aov[$i]->value ?? 0,
                        'peak_hour' => $peakHour[$i]['value'] ?? null,
                    ];
                }

                return array_values($result);
            }
        );
    }

    /**
     * Returns the top N performing days for a restaurant by revenue within a date range.
     * TTL: 1 hour. Historical ranking, changes slowly.
     */
    public function topPerformingDays(int $restaurantId, string $startDate, string $endDate, int $limit = 5): array
    {
        return Cache::remember(
            "analytics:top_days:{$restaurantId}:{$startDate}:{$endDate}:{$limit}",
            3600,
            fn() => DB::table('orders')
                ->selectRaw('DATE(order_time) as date, COUNT(*) as orders, SUM(order_amount) as revenue, AVG(order_amount) as aov')
                ->where('restaurant_id', $restaurantId)
                ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
                ->groupBy('date')
                ->orderByDesc('revenue')
                ->limit($limit)
                ->get()
                ->toArray()
        );
    }

    /**
     * Returns paginated orders for a restaurant within a date range.
     * TTL: 30 min. Orders are immutable once placed.
     */
    public function getPaginatedOrders(
        int $restaurantId, string $startDate, string $endDate, int $page, int $perPage,
        int $minAmount = 100, int $maxAmount = 10000, int $minHour = 0, int $maxHour = 23
    ): array {
        $cacheKey = "analytics:orders:{$restaurantId}:{$startDate}:{$endDate}:{$page}:{$perPage}:{$minAmount}:{$maxAmount}:{$minHour}:{$maxHour}";
        return Cache::remember($cacheKey, 1800, function () use ($restaurantId, $startDate, $endDate, $page, $perPage, $minAmount, $maxAmount, $minHour, $maxHour) {
            $result = DB::table('orders')
                ->where('restaurant_id', $restaurantId)
                ->whereBetween('order_time', [$startDate, $this->endOfDay($endDate)])
                ->where('order_amount', '>=', $minAmount)
                ->where('order_amount', '<=', $maxAmount)
                ->whereRaw('HOUR(order_time) >= ?', [$minHour])
                ->whereRaw('HOUR(order_time) < ?', [$maxHour])
                ->orderByDesc('order_time')
                ->select('id', 'order_time', 'order_amount')
                ->paginate($perPage, ['*'], 'page', $page);

            return [
                'data'         => $result->items(),
                'total'        => $result->total(),
                'per_page'     => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page'    => $result->lastPage(),
            ];
        });
    }

    // ============ Extra Analytics End =============


    // ============ Private Helpers =============

    /**
     * Appends 23:59:59 to a date string so whereBetween includes the full end day.
     */
    private function endOfDay(string $date): string
    {
        return $date . ' 23:59:59';
    }

    /**
     * TTL for summary KPIs (revenue, order count, AOV).
     * Uses a shorter TTL during typical meal-rush hours so data stays fresher
     * when owners are most likely watching the dashboard.
     * Peak hours heuristic: 11am-2pm and 6pm-9pm.
     */
    private function summaryTtl(): int
    {
        $peakHours = [11, 12, 13, 14, 18, 19, 20, 21];
        return in_array(now()->hour, $peakHours) ? 300 : 900; // 5 min : 15 min
    }
}
