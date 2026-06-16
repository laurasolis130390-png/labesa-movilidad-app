-- Configuracion completa LaBesa Movilidad.
-- Crea tablas faltantes, activa RLS y permite que usuarios autenticados
-- compartan y editen los mismos datos de la empresa.

create extension if not exists "pgcrypto";

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  internal_code text,
  unit_type text,
  brand text,
  model text,
  year integer,
  color text,
  plates text,
  vin text,
  engine_number text,
  driver_name text,
  status text default 'activo',
  photo_url text,
  circulation_card_photo_url text,
  insurance_policy_photo_url text,
  verification_sticker text,
  first_verification_due date,
  first_verification_status text default 'pendiente',
  second_verification_due date,
  second_verification_status text default 'pendiente',
  next_service_km numeric,
  next_service_status text default 'pendiente',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  ine text,
  license text,
  license_expiration date,
  contract_start date,
  contract_end date,
  contract_renewal_date date,
  vehicle_assigned text,
  license_photo_url text,
  photo_url text,
  notes text,
  status text default 'activo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.vehicle_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  document_name text,
  file_url text,
  issued_at date,
  expires_at date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  service_type text,
  service_date date,
  next_service_date date,
  current_km numeric,
  next_km numeric,
  provider text,
  cost numeric default 0,
  receipt_url text,
  status text default 'pendiente',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gps_units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  wialon_unit_id text,
  gps_name text,
  gps_status text default 'activo',
  last_location text,
  last_connection timestamptz,
  location_url text,
  payment_date date,
  expires_at date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  driver_name text,
  concept text,
  date date,
  amount numeric not null default 0,
  payment_method text,
  period text,
  receipt_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  concept text,
  date date,
  amount numeric not null default 0,
  category text,
  receipt_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  source_table text,
  source_id uuid,
  title text,
  status text,
  due_date date,
  created_at timestamptz default now()
);

alter table public.vehicles add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.drivers add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.vehicle_documents add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.services add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.gps_units add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.income add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.expenses add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.alerts add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;

alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.vehicle_documents enable row level security;
alter table public.services enable row level security;
alter table public.gps_units enable row level security;
alter table public.income enable row level security;
alter table public.expenses enable row level security;
alter table public.alerts enable row level security;

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
