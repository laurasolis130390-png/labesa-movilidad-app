-- Campos de calendario/documentos directamente en vehiculos.

alter table if exists public.vehicles add column if not exists insurance_expires_at date;
alter table if exists public.vehicles add column if not exists registration_expires_at date;
alter table if exists public.vehicles add column if not exists verification_expires_at date;
alter table if exists public.vehicles add column if not exists tax_expires_at date;
alter table if exists public.vehicles add column if not exists gps_expires_at date;
alter table if exists public.vehicles add column if not exists next_service_date date;
alter table if exists public.vehicles add column if not exists service_notes text;
