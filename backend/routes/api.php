<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AnalyticsController;

// Restaurant routes
// Note: /restaurants/top must be defined BEFORE /restaurants/{id}
// otherwise Laravel treats "top" as an ID.
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/top', [RestaurantController::class, 'top']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

// Analytics routes — all scoped to a restaurant ID
Route::prefix('analytics/{restaurantId}')->group(function () {
    Route::get('/summary',   [AnalyticsController::class, 'summary']);
    Route::get('/daily',     [AnalyticsController::class, 'daily']);
    Route::get('/top-days',  [AnalyticsController::class, 'topDays']);
    Route::get('/orders',    [AnalyticsController::class, 'orders']);
    Route::get('/peak-hour', [AnalyticsController::class, 'peakHour']);
    Route::get('/is-peak',   [AnalyticsController::class, 'isPeakHour']);
});
