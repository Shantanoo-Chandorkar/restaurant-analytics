<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('seeders/data/orders.json')), true);
        $now  = now()->toDateTimeString();

        $rows = array_map(fn($order) => [
            'restaurant_id' => $order['restaurant_id'],
            'order_time'    => $order['order_time'],
            'order_amount'  => $order['order_amount'],
            'created_at'    => $now,
            'updated_at'    => $now,
        ], $data);

        foreach (array_chunk($rows, 1000) as $chunk) {
            DB::table('orders')->insert($chunk);
        }
    }
}
