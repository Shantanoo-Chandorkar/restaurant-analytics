<?php

/**
 * Seed data generator
 *
 * Generates:
 *   - 100 restaurants  → backend/database/seeders/data/hundred-restaurants.json
 *   - 1,000,000 orders → backend/database/seeders/data/million-orders.json
 *
 * Run from the project root:
 *   php scripts/generate_seed_data.php
 */

$outputDir       = __DIR__ . '/../backend/database/seeders/data';
$restaurantsFile = $outputDir . '/hundred-restaurants.json';
$ordersFile      = $outputDir . '/million-orders.json';

// ---------------------------------------------------------------------------
// Restaurants
// ---------------------------------------------------------------------------

$prefixes = [
    'Golden', 'Silver', 'Royal', 'Grand', 'Urban',
    'Rustic', 'Coastal', 'Classic', 'Modern', 'Ancient',
    'Crimson', 'Amber', 'Jade', 'Ivory', 'Copper',
];

$suffixes = [
    'Kitchen', 'House', 'Garden', 'Palace', 'Corner',
    'Hub',     'Table',  'Bistro', 'Cafe',   'Grill',
    'Lounge',  'Spot',   'Diner',  'Terrace','Mess',
    'Shack',   'Vault',  'Cellar', 'Studio', 'Yard',
];

$cuisines = [
    'North Indian', 'South Indian', 'Mughlai',     'Bengali',    'Gujarati',
    'Punjabi',      'Kerala',       'Rajasthani',  'Hyderabadi', 'Biryani',
    'Japanese',     'Chinese',      'Thai',        'Vietnamese', 'Korean',
    'Italian',      'Mexican',      'American',    'Mediterranean', 'Continental',
    'French',       'Seafood',      'Street Food', 'Vegan',      'BBQ',
];

$cities = [
    'Mumbai',          'Delhi',           'Bangalore',    'Hyderabad',      'Chennai',
    'Kolkata',         'Pune',            'Ahmedabad',    'Jaipur',         'Lucknow',
    'Chandigarh',      'Kochi',           'Surat',        'Nagpur',         'Indore',
    'Bhopal',          'Patna',           'Varanasi',     'Agra',           'Amritsar',
    'Goa',             'Mysore',          'Coimbatore',   'Visakhapatnam',  'Bhubaneswar',
    'Dehradun',        'Noida',           'Gurugram',     'Thane',          'Madurai',
    'Nashik',          'Rajkot',          'Vadodara',     'Ludhiana',       'Jodhpur',
    'Ranchi',          'Raipur',          'Thiruvananthapuram', 'Mangalore', 'Udaipur',
];

echo "Generating restaurants...\n";

$restaurants = [];
$usedNames   = [];
$id          = 101;

foreach ($prefixes as $prefix) {
    foreach ($suffixes as $suffix) {
        $name = "$prefix $suffix";
        if (!isset($usedNames[$name])) {
            $usedNames[$name] = true;
            $restaurants[] = [
                'id'       => $id++,
                'name'     => $name,
                'cuisine'  => $cuisines[array_rand($cuisines)],
                'location' => $cities[array_rand($cities)],
            ];
        }
        if (count($restaurants) === 100) {
            break 2;
        }
    }
}

file_put_contents($restaurantsFile, json_encode($restaurants, JSON_PRETTY_PRINT));
echo "  Done — " . count($restaurants) . " restaurants written to $restaurantsFile\n\n";

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

$restaurantIds = array_column($restaurants, 'id');
$idCount       = count($restaurantIds);

$startTs  = mktime(0, 0, 0, 1,  1, 2024);   // 2024-01-01 00:00:00
$endTs    = mktime(23, 59, 59, 3, 24, 2026); // 2026-03-24 23:59:59
$tsRange  = $endTs - $startTs;

$totalOrders = 1_000_000;

echo "Generating $totalOrders orders (this may take a minute)...\n";

$fp = fopen($ordersFile, 'w');
if ($fp === false) {
    die("  ERROR: could not open $ordersFile for writing\n");
}

fwrite($fp, "[\n");

for ($i = 1; $i <= $totalOrders; $i++) {
    $entry = json_encode([
        'id'            => $i,
        'restaurant_id' => $restaurantIds[mt_rand(0, $idCount - 1)],
        'order_amount'  => mt_rand(500, 2000),
        'order_time'    => date('Y-m-d\TH:i:s', $startTs + mt_rand(0, $tsRange)),
    ]);

    fwrite($fp, $i < $totalOrders ? "  {$entry},\n" : "  {$entry}\n");

    if ($i % 100_000 === 0) {
        echo "  $i / $totalOrders orders written...\n";
    }
}

fwrite($fp, "]\n");
fclose($fp);

echo "  Done — $totalOrders orders written to $ordersFile\n";
echo "\nAll seed data generated successfully.\n";
