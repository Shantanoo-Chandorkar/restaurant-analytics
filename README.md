# Restaurant Analytics

**Author:** Shantanoo Chandorkar

---

## Description

Restaurant Analytics is a full-stack dashboard for analysing restaurant performance data.

- Analyse revenue, order volume, and average order value across restaurants
- Filter and search restaurants by name, cuisine, and location
- Visualise per-day breakdowns across 4 chart types (orders, revenue, AOV, peak hour)
- Compare any date range against a previous period or previous year
- Browse paginated order history per restaurant
- Identify top-performing restaurants and top-performing days by revenue

---

## Tech Stack

**Backend**
- PHP 8.4 / Laravel 13
- MySQL 8.0
- Redis 7

**Frontend**
- Next.js 16 (App Router) / React 19 / TypeScript 5
- Tailwind CSS 4
- Recharts 3 (charts)
- Zustand 5 (state management)
- React DatePicker 9

**Environment**
- Docker + Docker Compose (4 services: backend, frontend, db, redis)

---

> **Note on committed environment files:** This project intentionally commits environment variables and configuration files (e.g. `.env`, `docker-compose.yml` with credentials) to the repository. This is a deliberate decision made because this is an assignment project intended for straightforward evaluation. In a production environment, these files would never be committed to version control.

---

## Setup

### Prerequisites
- Docker and Docker Compose installed and running

### Steps

1. **Clone the repository**

2. **Build the containers**
   ```bash
   docker-compose build
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Generate the Laravel app key**
   ```bash
   docker exec restaurant_backend php artisan key:generate
   ```
   > The `docker-compose.yml` ships with `APP_KEY: ""`. This step writes the key into the running container's environment. After running it, restart the backend so the key takes effect:
   ```bash
   docker-compose restart backend
   ```

5. **Run migrations**
   ```bash
   docker exec restaurant_backend php artisan migrate
   ```

6. **Seed the database** (100 restaurants + 1 million orders)
   ```bash
   docker exec restaurant_backend php artisan db:seed
   ```
   > Seeding may take a few minutes.

7. **Open the dashboard**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api

---

## Troubleshooting

**Backend container exits immediately**
- `APP_KEY` is empty — run step 4 (`key:generate`) then restart the backend container.

**Migrations fail with "Connection refused"**
- MySQL may still be initialising. Wait for the healthcheck to pass, then re-run.
- Check service status: `docker-compose ps` — the `db` service should show `healthy`.

**Frontend shows API errors or blank data**
- Confirm the backend is up: `curl http://localhost:8000/up`
- Verify `NEXT_PUBLIC_API_URL` in `docker-compose.yml` matches the backend port.

**Resetting the database**
```bash
docker-compose down -v   # drops the db_data volume
docker-compose up -d     # restart, then repeat steps 4–6
```

**Viewing container logs**
```bash
docker-compose logs backend
docker-compose logs frontend
```

---

## Handling Large Dataset

The repository ships with pre-generated seed files. If you want to regenerate them (e.g. to change the date range or scale), follow these steps.

1. **Generate the JSON files** — run from the project root:
   ```bash
   php scripts/generate_seed_data.php
   ```
   This creates two files inside `backend/database/seeders/data/`:
   - `hundred-restaurants.json`
   - `million-orders.json`

2. **Swap the files** — rename the existing files as a backup, then rename the newly generated ones to the names the seeders expect:
   ```bash
   mv backend/database/seeders/data/restaurants.json backend/database/seeders/data/restaurants-old.json
   mv backend/database/seeders/data/orders.json backend/database/seeders/data/orders-old.json

   mv backend/database/seeders/data/hundred-restaurants.json backend/database/seeders/data/restaurants.json
   mv backend/database/seeders/data/million-orders.json backend/database/seeders/data/orders.json
   ```

3. **Clear existing data** — if the database already has restaurants or orders from a previous seed run, wipe the tables first to avoid primary key conflicts:
   ```bash
   docker exec restaurant_backend php artisan migrate:fresh
   ```

4. **Re-seed the database** — seed restaurants first, then orders with increased memory (1 million orders require ~4 GB to load and insert):
   ```bash
   docker exec restaurant_backend php artisan db:seed --class=RestaurantSeeder
   docker exec restaurant_backend php -d memory_limit=4G artisan db:seed --class=OrderSeeder
   ```
   > If seeding fails midway, reset the database first (`docker-compose down -v`), bring services back up, and re-run from step 3 of the Setup guide before re-seeding.

5. **Clear the Redis cache** — `migrate:fresh` wipes MySQL but leaves Redis untouched. Any date ranges queried before the re-seed will still return stale cached results unless the cache is cleared:
   ```bash
   docker exec restaurant_backend php artisan cache:clear
   ```
   > Skip this and you may see old data (e.g. 4 restaurants instead of 100) for date ranges that were previously cached, while other ranges look correct.

6. **Verify the counts** — confirm both tables have the expected number of rows:
   ```bash
   docker exec restaurant_backend php artisan tinker --execute="echo 'Restaurants: ' . \App\Models\Restaurant::count();"
   docker exec restaurant_backend php artisan tinker --execute="echo 'Orders: ' . \App\Models\Order::count();"
   ```
   Expected output:
   ```
   Restaurants: 100
   Orders: 1000000
   ```

---

## Features

**Restaurant Directory**
Browse all restaurants in a searchable, sortable grid; filter by cuisine or location.

**Global Date Range Picker**
Select any date window; all KPIs, charts, and tables update to reflect the chosen range.

**Period Comparison**
Compare the selected range against the previous equivalent period or the same period last year; deltas shown as ▲/▼ percentages.

**Top Performers**
Ranked list of the top 3 restaurants by revenue for the active date range with comparison data.

**Restaurant Detail — KPI Cards**
Per-restaurant summary of total orders, total revenue, and average order value with optional comparison overlay.

**Daily Charts (4 types)**
Interactive bar/line charts for daily orders, daily revenue, daily AOV, and daily peak order hour; comparison period rendered as overlay.

**Top Performing Days**
Table of the 5 highest-revenue days for a restaurant within the selected range.

**Paginated Order History**
Scrollable, paginated table of all orders for a restaurant (up to 50 per page) with timestamps and amounts.

**Smart Caching**
Redis-backed query cache with TTLs tuned by data type; shorter TTL during meal-rush hours (11am–2pm, 6pm–9pm) so dashboard data stays fresh when it matters most.

**Large Dataset Performance**
Handles 100 restaurants and 1 million orders without degradation; paginated queries, indexed foreign keys, and Redis caching ensure fast response times at scale.
