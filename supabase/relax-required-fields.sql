-- Permite guardar borradores aunque falten campos.
-- Evita errores de NOT NULL que pudieron quedar del primer esquema.

alter table if exists public.vehicles alter column internal_code drop not null;
alter table if exists public.drivers alter column full_name drop not null;
alter table if exists public.vehicle_documents alter column document_name drop not null;
alter table if exists public.services alter column service_type drop not null;
alter table if exists public.income alter column concept drop not null;
alter table if exists public.expenses alter column concept drop not null;
