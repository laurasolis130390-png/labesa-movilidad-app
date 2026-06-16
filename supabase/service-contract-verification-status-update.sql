-- Campos para cerrar alertas de verificacion/servicio y contratos de choferes.
-- Ejecutar una sola vez en Supabase SQL Editor.

alter table if exists public.vehicles
  add column if not exists first_verification_status text default 'pendiente',
  add column if not exists second_verification_status text default 'pendiente',
  add column if not exists next_service_km numeric,
  add column if not exists next_service_status text default 'pendiente';

alter table if exists public.drivers
  add column if not exists contract_start date,
  add column if not exists contract_end date,
  add column if not exists contract_renewal_date date;

alter table if exists public.services
  add column if not exists current_km numeric,
  add column if not exists next_km numeric,
  add column if not exists next_service_date date,
  add column if not exists cost numeric default 0,
  add column if not exists status text default 'pendiente';
