<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AnalyticsService;
use App\Traits\ApiResponse;

class AnalyticsController extends Controller
{
    use ApiResponse;

    public function __construct(private AnalyticsService $analyticsService) {}

    /**
     * GET /api/analytics/{restaurantId}/summary
     * Returns total revenue, order count, and AOV for a date range.
     * Query params: start_date, end_date (default: last 7 days)
     */
    public function summary(Request $request, int $restaurantId)
    {
        $startDate = $request->query('start_date', now()->subDays(7)->toDateString());
        $endDate   = $request->query('end_date', now()->toDateString());

        return $this->success($this->analyticsService->getSummary($restaurantId, $startDate, $endDate));
    }

    /**
     * GET /api/analytics/{restaurantId}/daily
     * Returns per-day breakdown of orders, revenue, AOV, and peak hour.
     * Query params: start_date, end_date (default: last 7 days)
     */
    public function daily(Request $request, int $restaurantId)
    {
        $startDate = $request->query('start_date', now()->subDays(7)->toDateString());
        $endDate   = $request->query('end_date', now()->toDateString());

        return $this->success($this->analyticsService->getDailyBreakdown($restaurantId, $startDate, $endDate));
    }

    /**
     * GET /api/analytics/{restaurantId}/top-days
     * Returns the top N performing days by revenue.
     * Query params: start_date, end_date, limit (default 5)
     */
    public function topDays(Request $request, int $restaurantId)
    {
        $startDate = $request->query('start_date', now()->subDays(30)->toDateString());
        $endDate   = $request->query('end_date', now()->toDateString());
        $limit     = (int) $request->query('limit', 5);

        return $this->success($this->analyticsService->topPerformingDays($restaurantId, $startDate, $endDate, $limit));
    }

    /**
     * GET /api/analytics/{restaurantId}/peak-hour
     * Returns the peak order hour (0-23) for a specific date.
     * Query params: date (default: today)
     */
    public function peakHour(Request $request, int $restaurantId)
    {
        $date = $request->query('date', now()->toDateString());

        return $this->success([
            'peak_hour' => $this->analyticsService->getPeakOrderHour($restaurantId, $date),
        ]);
    }

    /**
     * GET /api/analytics/{restaurantId}/orders
     * Returns paginated orders for a restaurant within a date range.
     * Query params: start_date, end_date, page (default 1), per_page (default 15, max 50)
     */
    public function orders(Request $request, int $restaurantId)
    {
        $startDate = $request->query('start_date', now()->subDays(7)->toDateString());
        $endDate   = $request->query('end_date', now()->toDateString());
        $page      = max(1, (int) $request->query('page', 1));
        $perPage   = min(50, max(1, (int) $request->query('per_page', 15)));

        return $this->success($this->analyticsService->getPaginatedOrders(
            $restaurantId, $startDate, $endDate, $page, $perPage
        ));
    }

    /**
     * GET /api/analytics/{restaurantId}/is-peak
     * Returns whether the current hour is within the average peak hour.
     * Query params: start_date, end_date (default: last 7 days)
     */
    public function isPeakHour(Request $request, int $restaurantId)
    {
        $startDate = $request->query('start_date', now()->subDays(7)->toDateString());
        $endDate   = $request->query('end_date', now()->toDateString());

        return $this->success([
            'is_peak' => $this->analyticsService->isCurrentlyPeakHour($restaurantId, $startDate, $endDate),
        ]);
    }
}
