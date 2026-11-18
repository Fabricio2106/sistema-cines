-- Almacenamiento de pósters: el administrador sube las imágenes desde el panel.
-- Va DESPUÉS de admin.sql (usa public.rol_personal). Se pega completo en
-- Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
--
-- El bucket es público: cualquiera con el enlace puede ver el póster (es lo que muestra la web).
-- Solo el administrador puede subir, ver la lista y borrar. Se aceptan JPG, PNG y WEBP de hasta 3 MB.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posters', 'posters', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "posters: admin sube" on storage.objects;
create policy "posters: admin sube" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'posters' and (select public.rol_personal()) = 'admin');

drop policy if exists "posters: admin borra" on storage.objects;
create policy "posters: admin borra" on storage.objects
  for delete to authenticated
  using (bucket_id = 'posters' and (select public.rol_personal()) = 'admin');

-- Para borrar un póster antiguo, Supabase primero tiene que poder ver el archivo.
drop policy if exists "posters: admin ve" on storage.objects;
create policy "posters: admin ve" on storage.objects
  for select to authenticated
  using (bucket_id = 'posters' and (select public.rol_personal()) = 'admin');
