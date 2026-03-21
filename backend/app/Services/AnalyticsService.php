<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Restaurant;

class AnalyticsService
{

    // ============ Total Analytics Start =============

    /**
     * Total revenue for a restaurant within a date range.
     */
    public function revenueForDateRange(int $restaurantId, string $startDate, string $endDate): float
    {
        return Restaurant::findOrFail($restaurantId)
            ->orders()
            ->whereBetween('order_time', [$startDate, $endDate])
            ->sum('order_amount');
    }

    /**
     * Total order count for a restaurant within a date range.
     */
    public function orderCountForDateRange(int $restaurantId, string $startDate, string $endDate): int
    {
        return Restaurant::findOrFail($restaurantId)
            ->orders()
            ->whereBetween('order_time', [$startDate, $endDate])
            ->count();
    }

    /**
     * Average order value (AOV) for a restaurant within a date range.
     */
    public function averageOrderValueForDateRange(int $restaurantId, string $startDate, string $endDate): float
    {
        return Restaurant::findOrFail($restaurantId)
            ->orders()
            ->whereBetween('order_time', [$startDate, $endDate])
            ->avg('order_amount') ?? 0;
    }

    /**
     * Returns the hour (0-23) with the highest order volume for a restaurant on a given date.
     * Returns 0 if no orders found.
     */
    public function getPeakOrderHour(int $restaurantId, string $date): int
    {
        $result = DB::table('orders')
            ->selectRaw('HOUR(order_time) as hour, COUNT(*) as total')
            ->where('restaurant_id', $restaurantId)
            ->whereDate('order_time', $date)
            ->groupBy('hour')
            ->orderByDesc('total')
            ->first();

        return $result ? $result->hour : 0;
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
            ->whereBetween('order_time', [$startDate, $endDate])
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
            ->whereBetween('order_time', [$startDate, $endDate])
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
            ->whereBetween('order_time', [$startDate, $endDate])
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
            ->whereBetween('order_time', [$startDate, $endDate])
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
     */
    public function isCurrentlyPeakHour(int $restaurantId, string $startDate, string $endDate): bool
    {
        $rows = DB::table('orders')
            ->selectRaw('DATE(order_time) as date, HOUR(order_time) as hour, COUNT(*) as total')
            ->where('restaurant_id', $restaurantId)
            ->whereBetween('order_time', [$startDate, $endDate])
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
     * Use this to power multi-metric charts or summary tables.
     */
    public function getDailyBreakdown(int $restaurantId, string $startDate, string $endDate): array
    {
        $orders = $this->ordersPerDay($restaurantId, $startDate, $endDate);
        $revenue = $this->revenuePerDay($restaurantId, $startDate, $endDate);
        $aov = $this->aovPerDay($restaurantId, $startDate, $endDate);
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

    /**
     * Returns the top N performing days for a restaurant by revenue within a date range.
     * Useful for highlighting best trading days to the restaurant owner.
     */
    public function topPerformingDays(int $restaurantId, string $startDate, string $endDate, int $limit = 5): array
    {
        return DB::table('orders')
            ->selectRaw('DATE(order_time) as date, COUNT(*) as orders, SUM(order_amount) as revenue, AVG(order_amount) as aov')
            ->where('restaurant_id', $restaurantId)
            ->whereBetween('order_time', [$startDate, $endDate])
            ->groupBy('date')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    // ============ Extra Analytics End =============
}
