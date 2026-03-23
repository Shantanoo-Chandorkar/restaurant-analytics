<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RestaurantService;
use App\Models\Restaurant;
use App\Http\Resources\RestaurantResource;
use App\Traits\ApiResponse;

class RestaurantController extends Controller
{
    use ApiResponse;

    public function __construct(private RestaurantService $restaurantService) {}

    /**
     * GET /api/restaurants
     * Returns all restaurants with optional search, sort, and filter.
     * Query params: search, cuisine, location, sort_by, sort_direction
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'cuisine', 'location', 'sort_by', 'sort_direction', 'start_date', 'end_date']);

        return $this->success($this->restaurantService->getRestaurants($filters));
    }

    /**
     * GET /api/restaurants/top
     * Returns top N restaurants by revenue for a date range.
     * Query params: start_date, end_date, limit (default 3)
     */
    public function top(Request $request)
    {
        $startDate = $request->query('start_date', now()->subDays(30)->toDateString());
        $endDate   = $request->query('end_date', now()->toDateString());
        $limit     = (int) $request->query('limit', 3);

        return $this->success($this->restaurantService->getTopByRevenue($startDate, $endDate, $limit));
    }

    /**
     * GET /api/restaurants/{id}
     * Returns a single restaurant by ID.
     * Throws ModelNotFoundException (→ 404) if not found.
     */
    public function show(string $id)
    {
        $restaurant = Restaurant::findOrFail($id);

        return $this->success(new RestaurantResource($restaurant));
    }
}
