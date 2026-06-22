-- Tabla segura para bitacora de kilometrajes.
-- No modifica ni borra servicios mecanicos existentes.

create table if not exists public.mileage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  vehicle_code text,
  reading_date date,
  kilometers numeric default 0,
  reason text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.mileage_logs enable row level security;

drop policy if exists "mileage_logs_shared_select" on public.mileage_logs;
drop policy if exists "mileage_logs_shared_insert" on public.mileage_logs;
drop policy if exists "mileage_logs_shared_update" on public.mileage_logs;
drop policy if exists "mileage_logs_shared_delete" on public.mileage_logs;

create policy "mileage_logs_shared_select" on public.mileage_logs for select using (auth.role() = 'authenticated');
create policy "mileage_logs_shared_insert" on public.mileage_logs for insert with check (auth.role() = 'authenticated');
create policy "mileage_logs_shared_update" on public.mileage_logs for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "mileage_logs_shared_delete" on public.mileage_logs for delete using (auth.role() = 'authenticated');
