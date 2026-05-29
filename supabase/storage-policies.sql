create policy "vehicle_photos_read_own"
on storage.objects for select
using (bucket_id = 'vehicle-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "vehicle_photos_write_own"
on storage.objects for insert
with check (bucket_id = 'vehicle-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "driver_photos_read_own"
on storage.objects for select
using (bucket_id = 'driver-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "driver_photos_write_own"
on storage.objects for insert
with check (bucket_id = 'driver-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "vehicle_documents_read_own"
on storage.objects for select
using (bucket_id = 'vehicle-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "vehicle_documents_write_own"
on storage.objects for insert
with check (bucket_id = 'vehicle-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "service_receipts_read_own"
on storage.objects for select
using (bucket_id = 'service-receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "service_receipts_write_own"
on storage.objects for insert
with check (bucket_id = 'service-receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "finance_receipts_read_own"
on storage.objects for select
using (bucket_id = 'finance-receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "finance_receipts_write_own"
on storage.objects for insert
with check (bucket_id = 'finance-receipts' and auth.uid()::text = (storage.foldername(name))[1]);
