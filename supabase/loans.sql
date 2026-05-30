-- Tabla de prestamos por cobrar para Finanzas.
-- Todos los usuarios autenticados de la app pueden ver y editar los mismos prestamos.

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  borrower_name text,
  vehicle_code text,
  loan_date date,
  amount numeric not null default 0,
  recovered_amount numeric not null default 0,
  due_date date,
  status text default 'pendiente',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.loans add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.loans add column if not exists borrower_name text;
alter table public.loans add column if not exists vehicle_code text;
alter table public.loans add column if not exists loan_date date;
alter table public.loans add column if not exists amount numeric default 0;
alter table public.loans add column if not exists recovered_amount numeric default 0;
alter table public.loans add column if not exists due_date date;
alter table public.loans add column if not exists status text default 'pendiente';
alter table public.loans add column if not exists notes text;
alter table public.loans add column if not exists created_at timestamptz default now();
alter table public.loans add column if not exists updated_at timestamptz default now();

alter table public.loans enable row level security;

drop policy if exists "loans_shared_select" on public.loans;
drop policy if exists "loans_shared_insert" on public.loans;
drop policy if exists "loans_shared_update" on public.loans;
drop policy if exists "loans_shared_delete" on public.loans;

create policy "loans_shared_select" on public.loans for select using (auth.role() = 'authenticated');
create policy "loans_shared_insert" on public.loans for insert with check (auth.role() = 'authenticated');
create policy "loans_shared_update" on public.loans for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "loans_shared_delete" on public.loans for delete using (auth.role() = 'authenticated');
