-- Reparacion para proyecto ya creado parcialmente.
-- Objetivo: permitir que usuarios autenticados compartan y editen la misma informacion.

alter table if exists public.vehicles add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table if exists public.drivers add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table if exists public.vehicle_documents add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table if exists public.services add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table if exists public.gps_units add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table if exists public.income add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table if exists public.expenses add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table if exists public.alerts add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;

alter table if exists public.vehicles enable row level security;
alter table if exists public.drivers enable row level security;
alter table if exists public.vehicle_documents enable row level security;
alter table if exists public.services enable row level security;
alter table if exists public.gps_units enable row level security;
alter table if exists public.income enable row level security;
alter table if exists public.expenses enable row level security;
alter table if exists public.alerts enable row level security;

drop policy if exists "vehicles_select_own" on public.vehicles;
drop policy if exists "vehicles_insert_own" on public.vehicles;
drop policy if exists "vehicles_update_own" on public.vehicles;
drop policy if exists "vehicles_delete_own" on public.vehicles;
drop policy if exists "vehicles_shared_select" on public.vehicles;
drop policy if exists "vehicles_shared_insert" on public.vehicles;
drop policy if exists "vehicles_shared_update" on public.vehicles;
drop policy if exists "vehicles_shared_delete" on public.vehicles;

drop policy if exists "drivers_select_own" on public.drivers;
drop policy if exists "drivers_insert_own" on public.drivers;
drop policy if exists "drivers_update_own" on public.drivers;
drop policy if exists "drivers_delete_own" on public.drivers;
drop policy if exists "drivers_shared_select" on public.drivers;
drop policy if exists "drivers_shared_insert" on public.drivers;
drop policy if exists "drivers_shared_update" on public.drivers;
drop policy if exists "drivers_shared_delete" on public.drivers;

drop policy if exists "vehicle_documents_select_own" on public.vehicle_documents;
drop policy if exists "vehicle_documents_insert_own" on public.vehicle_documents;
drop policy if exists "vehicle_documents_update_own" on public.vehicle_documents;
drop policy if exists "vehicle_documents_delete_own" on public.vehicle_documents;
drop policy if exists "vehicle_documents_shared_select" on public.vehicle_documents;
drop policy if exists "vehicle_documents_shared_insert" on public.vehicle_documents;
drop policy if exists "vehicle_documents_shared_update" on public.vehicle_documents;
drop policy if exists "vehicle_documents_shared_delete" on public.vehicle_documents;

drop policy if exists "services_select_own" on public.services;
drop policy if exists "services_insert_own" on public.services;
drop policy if exists "services_update_own" on public.services;
drop policy if exists "services_delete_own" on public.services;
drop policy if exists "services_shared_select" on public.services;
drop policy if exists "services_shared_insert" on public.services;
drop policy if exists "services_shared_update" on public.services;
drop policy if exists "services_shared_delete" on public.services;

drop policy if exists "gps_units_select_own" on public.gps_units;
drop policy if exists "gps_units_insert_own" on public.gps_units;
drop policy if exists "gps_units_update_own" on public.gps_units;
drop policy if exists "gps_units_delete_own" on public.gps_units;
drop policy if exists "gps_units_shared_select" on public.gps_units;
drop policy if exists "gps_units_shared_insert" on public.gps_units;
drop policy if exists "gps_units_shared_update" on public.gps_units;
drop policy if exists "gps_units_shared_delete" on public.gps_units;

drop policy if exists "income_select_own" on public.income;
drop policy if exists "income_insert_own" on public.income;
drop policy if exists "income_update_own" on public.income;
drop policy if exists "income_delete_own" on public.income;
drop policy if exists "income_shared_select" on public.income;
drop policy if exists "income_shared_insert" on public.income;
drop policy if exists "income_shared_update" on public.income;
drop policy if exists "income_shared_delete" on public.income;

drop policy if exists "expenses_select_own" on public.expenses;
drop policy if exists "expenses_insert_own" on public.expenses;
drop policy if exists "expenses_update_own" on public.expenses;
drop policy if exists "expenses_delete_own" on public.expenses;
drop policy if exists "expenses_shared_select" on public.expenses;
drop policy if exists "expenses_shared_insert" on public.expenses;
drop policy if exists "expenses_shared_update" on public.expenses;
drop policy if exists "expenses_shared_delete" on public.expenses;

drop policy if exists "alerts_select_own" on public.alerts;
drop policy if exists "alerts_insert_own" on public.alerts;
drop policy if exists "alerts_update_own" on public.alerts;
drop policy if exists "alerts_delete_own" on public.alerts;
drop policy if exists "alerts_shared_select" on public.alerts;
drop policy if exists "alerts_shared_insert" on public.alerts;
drop policy if exists "alerts_shared_update" on public.alerts;
drop policy if exists "alerts_shared_delete" on public.alerts;

create policy "vehicles_shared_select" on public.vehicles for select using (auth.role() = 'authenticated');
create policy "vehicles_shared_insert" on public.vehicles for insert with check (auth.role() = 'authenticated');
create policy "vehicles_shared_update" on public.vehicles for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "vehicles_shared_delete" on public.vehicles for delete using (auth.role() = 'authenticated');

create policy "drivers_shared_select" on public.drivers for select using (auth.role() = 'authenticated');
create policy "drivers_shared_insert" on public.drivers for insert with check (auth.role() = 'authenticated');
create policy "drivers_shared_update" on public.drivers for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "drivers_shared_delete" on public.drivers for delete using (auth.role() = 'authenticated');

create policy "vehicle_documents_shared_select" on public.vehicle_documents for select using (auth.role() = 'authenticated');
create policy "vehicle_documents_shared_insert" on public.vehicle_documents for insert with check (auth.role() = 'authenticated');
create policy "vehicle_documents_shared_update" on public.vehicle_documents for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "vehicle_documents_shared_delete" on public.vehicle_documents for delete using (auth.role() = 'authenticated');

create policy "services_shared_select" on public.services for select using (auth.role() = 'authenticated');
create policy "services_shared_insert" on public.services for insert with check (auth.role() = 'authenticated');
create policy "services_shared_update" on public.services for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "services_shared_delete" on public.services for delete using (auth.role() = 'authenticated');

create policy "gps_units_shared_select" on public.gps_units for select using (auth.role() = 'authenticated');
create policy "gps_units_shared_insert" on public.gps_units for insert with check (auth.role() = 'authenticated');
create policy "gps_units_shared_update" on public.gps_units for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gps_units_shared_delete" on public.gps_units for delete using (auth.role() = 'authenticated');

create policy "income_shared_select" on public.income for select using (auth.role() = 'authenticated');
create policy "income_shared_insert" on public.income for insert with check (auth.role() = 'authenticated');
create policy "income_shared_update" on public.income for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "income_shared_delete" on public.income for delete using (auth.role() = 'authenticated');

create policy "expenses_shared_select" on public.expenses for select using (auth.role() = 'authenticated');
create policy "expenses_shared_insert" on public.expenses for insert with check (auth.role() = 'authenticated');
create policy "expenses_shared_update" on public.expenses for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "expenses_shared_delete" on public.expenses for delete using (auth.role() = 'authenticated');

create policy "alerts_shared_select" on public.alerts for select using (auth.role() = 'authenticated');
create policy "alerts_shared_insert" on public.alerts for insert with check (auth.role() = 'authenticated');
create policy "alerts_shared_update" on public.alerts for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "alerts_shared_delete" on public.alerts for delete using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values
  ('vehicle-photos', 'vehicle-photos', true),
  ('driver-photos', 'driver-photos', true),
  ('vehicle-documents', 'vehicle-documents', true),
  ('service-receipts', 'service-receipts', true),
  ('finance-receipts', 'finance-receipts', true)
on conflict (id) do nothing;
