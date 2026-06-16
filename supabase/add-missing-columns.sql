-- Sincroniza columnas faltantes entre la app y Supabase.

alter table if exists public.vehicles add column if not exists internal_code text;
alter table if exists public.vehicles add column if not exists unit_type text;
alter table if exists public.vehicles add column if not exists brand text;
alter table if exists public.vehicles add column if not exists model text;
alter table if exists public.vehicles add column if not exists year integer;
alter table if exists public.vehicles add column if not exists color text;
alter table if exists public.vehicles add column if not exists plates text;
alter table if exists public.vehicles add column if not exists vin text;
alter table if exists public.vehicles add column if not exists engine_number text;
alter table if exists public.vehicles add column if not exists driver_name text;
alter table if exists public.vehicles add column if not exists status text default 'activo';
alter table if exists public.vehicles add column if not exists photo_url text;
alter table if exists public.vehicles add column if not exists circulation_card_photo_url text;
alter table if exists public.vehicles add column if not exists insurance_policy_photo_url text;
alter table if exists public.vehicles add column if not exists verification_sticker text;
alter table if exists public.vehicles add column if not exists first_verification_due date;
alter table if exists public.vehicles add column if not exists second_verification_due date;
alter table if exists public.vehicles add column if not exists notes text;
alter table if exists public.vehicles add column if not exists created_at timestamptz default now();
alter table if exists public.vehicles add column if not exists updated_at timestamptz default now();

alter table if exists public.drivers add column if not exists full_name text;
alter table if exists public.drivers add column if not exists phone text;
alter table if exists public.drivers add column if not exists address text;
alter table if exists public.drivers add column if not exists ine text;
alter table if exists public.drivers add column if not exists license text;
alter table if exists public.drivers add column if not exists license_expiration date;
alter table if exists public.drivers add column if not exists vehicle_assigned text;
alter table if exists public.drivers add column if not exists license_photo_url text;
alter table if exists public.drivers add column if not exists photo_url text;
alter table if exists public.drivers add column if not exists notes text;
alter table if exists public.drivers add column if not exists status text default 'activo';

alter table if exists public.vehicle_documents add column if not exists vehicle_code text;
alter table if exists public.vehicle_documents add column if not exists document_name text;
alter table if exists public.vehicle_documents add column if not exists file_url text;
alter table if exists public.vehicle_documents add column if not exists issued_at date;
alter table if exists public.vehicle_documents add column if not exists expires_at date;
alter table if exists public.vehicle_documents add column if not exists notes text;

alter table if exists public.services add column if not exists vehicle_code text;
alter table if exists public.services add column if not exists service_type text;
alter table if exists public.services add column if not exists service_date date;
alter table if exists public.services add column if not exists next_service_date date;
alter table if exists public.services add column if not exists current_km numeric;
alter table if exists public.services add column if not exists next_km numeric;
alter table if exists public.services add column if not exists provider text;
alter table if exists public.services add column if not exists cost numeric default 0;
alter table if exists public.services add column if not exists receipt_url text;
alter table if exists public.services add column if not exists status text default 'pendiente';
alter table if exists public.services add column if not exists notes text;

alter table if exists public.gps_units add column if not exists vehicle_code text;
alter table if exists public.gps_units add column if not exists wialon_unit_id text;
alter table if exists public.gps_units add column if not exists gps_name text;
alter table if exists public.gps_units add column if not exists gps_status text default 'activo';
alter table if exists public.gps_units add column if not exists last_location text;
alter table if exists public.gps_units add column if not exists last_connection timestamptz;
alter table if exists public.gps_units add column if not exists location_url text;
alter table if exists public.gps_units add column if not exists payment_date date;
alter table if exists public.gps_units add column if not exists expires_at date;
alter table if exists public.gps_units add column if not exists notes text;

alter table if exists public.income add column if not exists vehicle_code text;
alter table if exists public.income add column if not exists driver_name text;
alter table if exists public.income add column if not exists concept text;
alter table if exists public.income add column if not exists date date;
alter table if exists public.income add column if not exists amount numeric default 0;
alter table if exists public.income add column if not exists payment_method text;
alter table if exists public.income add column if not exists period text;
alter table if exists public.income add column if not exists receipt_url text;
alter table if exists public.income add column if not exists notes text;

alter table if exists public.expenses add column if not exists vehicle_code text;
alter table if exists public.expenses add column if not exists concept text;
alter table if exists public.expenses add column if not exists date date;
alter table if exists public.expenses add column if not exists amount numeric default 0;
alter table if exists public.expenses add column if not exists category text;
alter table if exists public.expenses add column if not exists receipt_url text;
alter table if exists public.expenses add column if not exists notes text;
