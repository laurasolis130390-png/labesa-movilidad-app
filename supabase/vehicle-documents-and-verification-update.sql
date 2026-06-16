-- Campos nuevos para vehiculos y choferes.
-- Ejecutar una sola vez en Supabase SQL Editor.

alter table if exists public.vehicles
  add column if not exists circulation_card_photo_url text,
  add column if not exists insurance_policy_photo_url text,
  add column if not exists verification_sticker text,
  add column if not exists first_verification_due date,
  add column if not exists second_verification_due date;

alter table if exists public.drivers
  add column if not exists license_photo_url text;

insert into storage.buckets (id, name, public)
values
  ('vehicle-documents', 'vehicle-documents', true),
  ('driver-photos', 'driver-photos', true)
on conflict (id) do nothing;
