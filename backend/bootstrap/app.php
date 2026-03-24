<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 404 — model not found (triggered by findOrFail())
        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found.',
                'data'    => null,
            ], 404);
        });

        // 500 — database error (connection issues, bad queries, constraint violations)
        $exceptions->render(function (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service temporarily unavailable. Please try again later.',
                'data'    => null,
            ], 500);
        });

        // 500 — unexpected catch-all (always last)
        $exceptions->render(function (\Throwable $e) {
            if (app()->environment('local')) {
                // In local dev, expose the real error so you can debug
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'data'    => null,
                ], 500);
            }

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred.',
                'data'    => null,
            ], 500);
        });
    })->create();
