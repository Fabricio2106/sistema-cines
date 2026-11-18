-- Activa Realtime en las tablas de la cartelera para que la web se actualice sola cuando
-- cambian películas, funciones o salas. Va DESPUÉS de cartelera.sql.
-- Se pega completo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
--
-- Solo se publican datos que ya son de lectura pública (ver las políticas de cartelera.sql).
-- Las compras NO se publican: las butacas ocupadas se avisan con señales de Broadcast
-- desde la web y siempre se vuelven a leer con asientos_ocupados().

do $$
declare
  tabla text;
begin
  foreach tabla in array array['peliculas', 'funciones', 'salas'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = tabla
    ) then
      execute format('alter publication supabase_realtime add table public.%I', tabla);
    end if;
  end loop;
end $$;
