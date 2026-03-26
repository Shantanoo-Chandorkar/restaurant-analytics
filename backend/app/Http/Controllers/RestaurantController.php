<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnalyticsRequest;
use App\Services\RestaurantService;
use App\Services\AnalyticsService;
use App\Models\Restaurant;
use App\Http\Resources\RestaurantResource;
use App\Traits\ApiResponse;

class RestaurantController extends Controller
{
    use ApiResponse;

    public function __construct(
        private RestaurantService $restaurantService,
        private AnalyticsService $analyticsService
    ) {}

    /**
     * GET /api/restaurants
     * Returns all restaurants with optional search, sort, and filter.
     * Query params: search, cuisine, location, sort_by, sort_direction
     */
    public function index(AnalyticsRequest $request)
    {
        $filters = $request->only(['search', 'cuisine', 'location', 'sort_by', 'sort_direction', 'start_date', 'end_date']);

        return $this->success($this->restaurantService->getRestaurants($filters));
    }

    /**
     * GET /api/restaurants/top
     * Returns top N restaurants by revenue for a date range.
     * Query params: start_date, end_date, limit (default 3)
     */
    public function top(AnalyticsRequest $request)
    {
        $startDate = $request->query('start_date', now()->subDays(30)->toDateString());
        $endDate   = $request->query('end_date', now()->toDateString());
        $limit     = (int) $request->query('limit', 3);

        return $this->success($this->restaurantService->getTopByRevenue($startDate, $endDate, $limit));
    }

    /**
     * GET /api/restaurants/{id}
     * Returns a single restaurant by ID.
     * When start_date and end_date are provided, also embeds a summary key.
     * Throws ModelNotFoundException (→ 404) if not found.
     */
    public function show(AnalyticsRequest $request, string $id)
    {
        $restaurant = Restaurant::findOrFail($id);

        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');

        if ($startDate && $endDate) {
            $data = (new RestaurantResource($restaurant))->toArray($request);
            $data['summary'] = $this->analyticsService->getSummary((int) $id, $startDate, $endDate);
            return $this->success($data);
        }

        return $this->success(new RestaurantResource($restaurant));
    }
}
