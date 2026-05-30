-- Politicas de Storage para app compartida.
-- Todos los usuarios autenticados pueden leer y subir archivos de la empresa.

drop policy if exists "vehicle_photos_read_own" on storage.objects;
drop policy if exists "vehicle_photos_write_own" on storage.objects;
drop policy if exists "driver_photos_read_own" on storage.objects;
drop policy if exists "driver_photos_write_own" on storage.objects;
drop policy if exists "vehicle_documents_read_own" on storage.objects;
drop policy if exists "vehicle_documents_write_own" on storage.objects;
drop policy if exists "service_receipts_read_own" on storage.objects;
drop policy if exists "service_receipts_write_own" on storage.objects;
drop policy if exists "finance_receipts_read_own" on storage.objects;
drop policy if exists "finance_receipts_write_own" on storage.objects;

create policy "vehicle_photos_shared_read"
on storage.objects for select
using (bucket_id = 'vehicle-photos' and auth.role() = 'authenticated');

create policy "vehicle_photos_shared_write"
on storage.objects for insert
with check (bucket_id = 'vehicle-photos' and auth.role() = 'authenticated');

create policy "driver_photos_shared_read"
on storage.objects for select
using (bucket_id = 'driver-photos' and auth.role() = 'authenticated');

create policy "driver_photos_shared_write"
on storage.objects for insert
with check (bucket_id = 'driver-photos' and auth.role() = 'authenticated');

create policy "vehicle_documents_shared_read"
on storage.objects for select
using (bucket_id = 'vehicle-documents' and auth.role() = 'authenticated');

create policy "vehicle_documents_shared_write"
on storage.objects for insert
with check (bucket_id = 'vehicle-documents' and auth.role() = 'authenticated');

create policy "service_receipts_shared_read"
on storage.objects for select
using (bucket_id = 'service-receipts' and auth.role() = 'authenticated');

create policy "service_receipts_shared_write"
on storage.objects for insert
with check (bucket_id = 'service-receipts' and auth.role() = 'authenticated');

create policy "finance_receipts_shared_read"
on storage.objects for select
using (bucket_id = 'finance-receipts' and auth.role() = 'authenticated');

create policy "finance_receipts_shared_write"
on storage.objects for insert
with check (bucket_id = 'finance-receipts' and auth.role() = 'authenticated');
