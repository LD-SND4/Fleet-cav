-- =========================================================
-- LOGISTICS FLEETS, DRIVERS, SHIPMENTS AND STOPS
-- SAFE MIGRATION VERSION
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- ENABLE + FORCE RLS
-- =========================================================

alter table public.fleets enable row level security;
alter table public.drivers enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_stops enable row level security;
alter table public.cargo_photos enable row level security;
alter table public.vehicle_telemetry enable row level security;
alter table public.driver_events enable row level security;

alter table public.fleets force row level security;
alter table public.drivers force row level security;
alter table public.shipments force row level security;
alter table public.shipment_stops force row level security;
alter table public.cargo_photos force row level security;
alter table public.vehicle_telemetry force row level security;
alter table public.driver_events force row level security;

-- =========================================================
-- READ POLICIES
-- =========================================================

drop policy if exists "Authenticated read fleets"
on public.fleets;

create policy "Authenticated read fleets"
on public.fleets
for select
to authenticated
using (true);

drop policy if exists "Authenticated read drivers"
on public.drivers;

create policy "Authenticated read drivers"
on public.drivers
for select
to authenticated
using (true);

drop policy if exists "Authenticated read shipments"
on public.shipments;

create policy "Authenticated read shipments"
on public.shipments
for select
to authenticated
using (true);

drop policy if exists "Authenticated read shipment_stops"
on public.shipment_stops;

create policy "Authenticated read shipment_stops"
on public.shipment_stops
for select
to authenticated
using (true);

drop policy if exists "Authenticated read cargo_photos"
on public.cargo_photos;

create policy "Authenticated read cargo_photos"
on public.cargo_photos
for select
to authenticated
using (true);

drop policy if exists "Authenticated read vehicle_telemetry"
on public.vehicle_telemetry;

create policy "Authenticated read vehicle_telemetry"
on public.vehicle_telemetry
for select
to authenticated
using (true);

drop policy if exists "Authenticated read driver_events"
on public.driver_events;

create policy "Authenticated read driver_events"
on public.driver_events
for select
to authenticated
using (true);

-- =========================================================
-- WRITE POLICIES
-- =========================================================

drop policy if exists "Authenticated insert shipments"
on public.shipments;

create policy "Authenticated insert shipments"
on public.shipments
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated update shipments"
on public.shipments;

create policy "Authenticated update shipments"
on public.shipments
for update
to authenticated
using (true);

drop policy if exists "Authenticated insert telemetry"
on public.vehicle_telemetry;

create policy "Authenticated insert telemetry"
on public.vehicle_telemetry
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated insert driver_events"
on public.driver_events;

create policy "Authenticated insert driver_events"
on public.driver_events
for insert
to authenticated
with check (true);

-- =========================================================
-- PERFORMANCE INDEXES
-- =========================================================

create index if not exists idx_shipments_vehicle_type
on public.shipments(vehicle_type);

create index if not exists idx_vehicle_telemetry_shipment_id
on public.vehicle_telemetry(shipment_id);

create index if not exists idx_vehicle_telemetry_recorded_at
on public.vehicle_telemetry(recorded_at);

create index if not exists idx_vehicle_telemetry_shipment_time
on public.vehicle_telemetry(
shipment_id,
recorded_at desc
);

create index if not exists idx_driver_events_shipment_id
on public.driver_events(shipment_id);

create index if not exists idx_driver_events_driver_id
on public.driver_events(driver_id);

create index if not exists idx_driver_events_created_at
on public.driver_events(created_at desc);
