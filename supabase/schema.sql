create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  internal_code text not null,
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
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  address text,
  ine text,
  license text,
  license_expiration date,
  vehicle_assigned text,
  photo_url text,
  notes text,
  status text default 'activo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.vehicle_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  document_name text not null,
  file_url text,
  issued_at date,
  expires_at date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  service_type text not null,
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
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
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
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  driver_name text,
  concept text not null,
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
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  concept text not null,
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
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  source_table text,
  source_id uuid,
  title text not null,
  status text,
  due_date date,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.vehicle_documents enable row level security;
alter table public.services enable row level security;
alter table public.gps_units enable row level security;
alter table public.income enable row level security;
alter table public.expenses enable row level security;
alter table public.alerts enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

create policy "vehicles_select_own" on public.vehicles for select using (auth.uid() = user_id);
create policy "vehicles_insert_own" on public.vehicles for insert with check (auth.uid() = user_id);
create policy "vehicles_update_own" on public.vehicles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vehicles_delete_own" on public.vehicles for delete using (auth.uid() = user_id);

create policy "drivers_select_own" on public.drivers for select using (auth.uid() = user_id);
create policy "drivers_insert_own" on public.drivers for insert with check (auth.uid() = user_id);
create policy "drivers_update_own" on public.drivers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "drivers_delete_own" on public.drivers for delete using (auth.uid() = user_id);

create policy "vehicle_documents_select_own" on public.vehicle_documents for select using (auth.uid() = user_id);
create policy "vehicle_documents_insert_own" on public.vehicle_documents for insert with check (auth.uid() = user_id);
create policy "vehicle_documents_update_own" on public.vehicle_documents for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vehicle_documents_delete_own" on public.vehicle_documents for delete using (auth.uid() = user_id);

create policy "services_select_own" on public.services for select using (auth.uid() = user_id);
create policy "services_insert_own" on public.services for insert with check (auth.uid() = user_id);
create policy "services_update_own" on public.services for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "services_delete_own" on public.services for delete using (auth.uid() = user_id);

create policy "gps_units_select_own" on public.gps_units for select using (auth.uid() = user_id);
create policy "gps_units_insert_own" on public.gps_units for insert with check (auth.uid() = user_id);
create policy "gps_units_update_own" on public.gps_units for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "gps_units_delete_own" on public.gps_units for delete using (auth.uid() = user_id);

create policy "income_select_own" on public.income for select using (auth.uid() = user_id);
create policy "income_insert_own" on public.income for insert with check (auth.uid() = user_id);
create policy "income_update_own" on public.income for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "income_delete_own" on public.income for delete using (auth.uid() = user_id);

create policy "expenses_select_own" on public.expenses for select using (auth.uid() = user_id);
create policy "expenses_insert_own" on public.expenses for insert with check (auth.uid() = user_id);
create policy "expenses_update_own" on public.expenses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "expenses_delete_own" on public.expenses for delete using (auth.uid() = user_id);

create policy "alerts_select_own" on public.alerts for select using (auth.uid() = user_id);
create policy "alerts_insert_own" on public.alerts for insert with check (auth.uid() = user_id);
create policy "alerts_update_own" on public.alerts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "alerts_delete_own" on public.alerts for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values
  ('vehicle-photos', 'vehicle-photos', true),
  ('driver-photos', 'driver-photos', true),
  ('vehicle-documents', 'vehicle-documents', true),
  ('service-receipts', 'service-receipts', true),
  ('finance-receipts', 'finance-receipts', true)
on conflict (id) do nothing;
