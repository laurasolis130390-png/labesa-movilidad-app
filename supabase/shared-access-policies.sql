-- Usa este archivo si LaBesa Movilidad sera compartida por 2 o mas usuarios
-- del mismo negocio. Todos los usuarios autenticados podran ver y editar
-- los mismos vehiculos, choferes, documentos, servicios, GPS y finanzas.
--
-- Ejecuta primero supabase/schema.sql y despues este archivo.

drop policy if exists "vehicles_select_own" on public.vehicles;
drop policy if exists "vehicles_insert_own" on public.vehicles;
drop policy if exists "vehicles_update_own" on public.vehicles;
drop policy if exists "vehicles_delete_own" on public.vehicles;

drop policy if exists "drivers_select_own" on public.drivers;
drop policy if exists "drivers_insert_own" on public.drivers;
drop policy if exists "drivers_update_own" on public.drivers;
drop policy if exists "drivers_delete_own" on public.drivers;

drop policy if exists "vehicle_documents_select_own" on public.vehicle_documents;
drop policy if exists "vehicle_documents_insert_own" on public.vehicle_documents;
drop policy if exists "vehicle_documents_update_own" on public.vehicle_documents;
drop policy if exists "vehicle_documents_delete_own" on public.vehicle_documents;

drop policy if exists "services_select_own" on public.services;
drop policy if exists "services_insert_own" on public.services;
drop policy if exists "services_update_own" on public.services;
drop policy if exists "services_delete_own" on public.services;

drop policy if exists "gps_units_select_own" on public.gps_units;
drop policy if exists "gps_units_insert_own" on public.gps_units;
drop policy if exists "gps_units_update_own" on public.gps_units;
drop policy if exists "gps_units_delete_own" on public.gps_units;

drop policy if exists "income_select_own" on public.income;
drop policy if exists "income_insert_own" on public.income;
drop policy if exists "income_update_own" on public.income;
drop policy if exists "income_delete_own" on public.income;

drop policy if exists "expenses_select_own" on public.expenses;
drop policy if exists "expenses_insert_own" on public.expenses;
drop policy if exists "expenses_update_own" on public.expenses;
drop policy if exists "expenses_delete_own" on public.expenses;

drop policy if exists "alerts_select_own" on public.alerts;
drop policy if exists "alerts_insert_own" on public.alerts;
drop policy if exists "alerts_update_own" on public.alerts;
drop policy if exists "alerts_delete_own" on public.alerts;

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
