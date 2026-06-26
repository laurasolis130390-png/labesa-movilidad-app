create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  driver_name text,
  incident_date date,
  incident_type text default 'choque',
  description text,
  cost numeric default 0,
  payer text default 'chofer',
  status text default 'pendiente',
  photo_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.incidents enable row level security;

drop policy if exists "incidents_shared_select" on public.incidents;
drop policy if exists "incidents_shared_insert" on public.incidents;
drop policy if exists "incidents_shared_update" on public.incidents;
drop policy if exists "incidents_shared_delete" on public.incidents;

create policy "incidents_shared_select" on public.incidents
for select using (auth.role() = 'authenticated');

create policy "incidents_shared_insert" on public.incidents
for insert with check (auth.role() = 'authenticated');

create policy "incidents_shared_update" on public.incidents
for update using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "incidents_shared_delete" on public.incidents
for delete using (auth.role() = 'authenticated');

alter table if exists public.services alter column service_type drop not null;
alter table if exists public.expenses alter column concept drop not null;
