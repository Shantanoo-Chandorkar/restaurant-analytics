<?php

namespace App\Traits;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

trait FallibleCache
{
    protected function safeRemember(string $key, int $ttl, Closure $callback): mixed
    {
        try {
            return Cache::remember($key, $ttl, $callback);
        } catch (\Exception $e) {
            Log::warning('Cache unavailable, falling back to direct query.', [
                'key'       => $key,
                'exception' => $e->getMessage(),
            ]);
            return $callback();
        }
    }
}
