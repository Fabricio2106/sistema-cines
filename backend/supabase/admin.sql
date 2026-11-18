-- Panel de administración: personal con rol, permisos para editar la cartelera y
-- consultas del panel (ventas, validación de entradas).
-- Va DESPUÉS de schema.sql, cartelera.sql, fecha-estreno.sql, trailers.sql y fechas-funciones.sql.
-- Se pega completo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
--
-- Si vuelves a ejecutar cartelera.sql, ejecuta este archivo otra vez: cartelera.sql
-- quita los permisos de escritura que aquí se conceden.
--
-- Quién entra al panel: solo cuentas que estén en la tabla `personal`. Se agregan a mano
-- desde el SQL Editor (la web nunca puede darse permisos a sí misma). Ejemplo al final.

-- ── Personal ────────────────────────────────────────────────────────────
create table if not exists public.personal (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  rol        text not null check (rol in ('admin', 'boleteria')),
  created_at timestamptz not null default now()
);

alter table public.personal enable row level security;

-- Cada persona solo puede ver su propio rol.
drop policy if exists "personal: leer el propio rol" on public.personal;
create policy "personal: leer el propio rol" on public.personal
  for select to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.personal from anon, authenticated;
grant select on public.personal to authenticated;

-- Rol de quien tiene la sesión abierta: 'admin', 'boleteria' o null si no es personal.
create or replace function public.rol_personal()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select rol from public.personal where user_id = (select auth.uid());
$$;

revoke all on function public.rol_personal() from public;
grant execute on function public.rol_personal() to authenticated;

-- ── Cartelera: el administrador puede ver todo, crear y editar ──────────
-- La lectura pública de cartelera.sql sigue igual (solo películas y funciones activas).
-- No hay permiso de borrar: para quitar algo se desactiva (activa = false).
grant insert, update on public.peliculas, public.funciones to authenticated;
grant insert, update on public.salas to authenticated;

drop policy if exists "peliculas: admin ve todo" on public.peliculas;
create policy "peliculas: admin ve todo" on public.peliculas
  for select to authenticated using ((select public.rol_personal()) = 'admin');
drop policy if exists "peliculas: admin crea" on public.peliculas;
create policy "peliculas: admin crea" on public.peliculas
  for insert to authenticated with check ((select public.rol_personal()) = 'admin');
drop policy if exists "peliculas: admin edita" on public.peliculas;
create policy "peliculas: admin edita" on public.peliculas
  for update to authenticated
  using ((select public.rol_personal()) = 'admin')
  with check ((select public.rol_personal()) = 'admin');

drop policy if exists "funciones: admin ve todo" on public.funciones;
create policy "funciones: admin ve todo" on public.funciones
  for select to authenticated using ((select public.rol_personal()) = 'admin');
drop policy if exists "funciones: admin crea" on public.funciones;
create policy "funciones: admin crea" on public.funciones
  for insert to authenticated with check ((select public.rol_personal()) = 'admin');
drop policy if exists "funciones: admin edita" on public.funciones;
create policy "funciones: admin edita" on public.funciones
  for update to authenticated
  using ((select public.rol_personal()) = 'admin')
  with check ((select public.rol_personal()) = 'admin');

drop policy if exists "salas: admin crea" on public.salas;
create policy "salas: admin crea" on public.salas
  for insert to authenticated with check ((select public.rol_personal()) = 'admin');
drop policy if exists "salas: admin edita" on public.salas;
create policy "salas: admin edita" on public.salas
  for update to authenticated
  using ((select public.rol_personal()) = 'admin')
  with check ((select public.rol_personal()) = 'admin');

-- ── Entradas usadas ─────────────────────────────────────────────────────
alter table public.compras add column if not exists usada boolean not null default false;
alter table public.compras add column if not exists usada_en timestamptz;

-- ── Consultas del panel ─────────────────────────────────────────────────
-- Todas comprueban que quien llama sea personal. Los datos de los clientes (nombre) solo
-- salen por aquí; la tabla `compras` sigue siendo legible únicamente por su dueño.

create or replace function public.panel_compras(p_limite integer default 200)
returns table (
  codigo text, cliente text, pelicula text, fecha date, hora text, sala text,
  asientos text[], total integer, usada boolean, creada_en timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select public.rol_personal()) is null then
    raise exception 'No tienes permiso para ver esto' using errcode = '42501';
  end if;
  return query
    select c.codigo,
           coalesce(
             nullif(trim(coalesce(u.raw_user_meta_data ->> 'nombre', '') || ' ' || coalesce(u.raw_user_meta_data ->> 'apellidos', '')), ''),
             u.email::text
           ),
           c.titulo, c.fecha, c.hora, c.sala, c.asientos, c.total, c.usada, c.created_at
    from public.compras c
    left join auth.users u on u.id = c.user_id
    order by c.created_at desc
    limit greatest(least(coalesce(p_limite, 200), 500), 1);
end;
$$;

create or replace function public.panel_buscar_compra(p_codigo text)
returns table (
  codigo text, cliente text, pelicula text, fecha date, hora text, sala text,
  asientos text[], total integer, usada boolean, creada_en timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select public.rol_personal()) is null then
    raise exception 'No tienes permiso para ver esto' using errcode = '42501';
  end if;
  return query
    select c.codigo,
           coalesce(
             nullif(trim(coalesce(u.raw_user_meta_data ->> 'nombre', '') || ' ' || coalesce(u.raw_user_meta_data ->> 'apellidos', '')), ''),
             u.email::text
           ),
           c.titulo, c.fecha, c.hora, c.sala, c.asientos, c.total, c.usada, c.created_at
    from public.compras c
    left join auth.users u on u.id = c.user_id
    where c.codigo = upper(trim(p_codigo))
    limit 1;
end;
$$;

-- Marca la entrada como usada. El UPDATE es atómico: si dos boleteros la escanean a la vez,
-- solo uno lo logra y el otro recibe "ya fue usada".
create or replace function public.panel_marcar_usada(p_codigo text)
returns table (
  codigo text, cliente text, pelicula text, fecha date, hora text, sala text,
  asientos text[], total integer, usada boolean, creada_en timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_codigo text := upper(trim(p_codigo));
begin
  if (select public.rol_personal()) is null then
    raise exception 'No tienes permiso para hacer esto' using errcode = '42501';
  end if;

  perform 1 from public.compras c where c.codigo = v_codigo;
  if not found then
    raise exception 'No existe esa entrada';
  end if;

  update public.compras c set usada = true, usada_en = now()
  where c.codigo = v_codigo and not c.usada;
  if not found then
    raise exception 'Esa entrada ya fue usada';
  end if;

  return query select * from public.panel_buscar_compra(v_codigo);
end;
$$;

-- Entradas e ingresos de los últimos 7 días (hora de Lima), por día de compra.
create or replace function public.panel_ventas_semana()
returns table (dia date, entradas integer, ingresos integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_hoy date := (now() at time zone 'America/Lima')::date;
begin
  if (select public.rol_personal()) is null then
    raise exception 'No tienes permiso para ver esto' using errcode = '42501';
  end if;
  return query
    select d.dia,
           coalesce(sum(cardinality(c.asientos)), 0)::integer,
           coalesce(sum(c.total), 0)::integer
    from (select v_hoy - g as dia from generate_series(0, 6) g) d
    left join public.compras c on (c.created_at at time zone 'America/Lima')::date = d.dia
    group by d.dia
    order by d.dia;
end;
$$;

-- Las 4 películas más vendidas de los últimos 7 días.
create or replace function public.panel_top_peliculas()
returns table (titulo text, entradas integer, ingresos integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_hoy date := (now() at time zone 'America/Lima')::date;
begin
  if (select public.rol_personal()) is null then
    raise exception 'No tienes permiso para ver esto' using errcode = '42501';
  end if;
  return query
    select c.titulo,
           sum(cardinality(c.asientos))::integer,
           sum(c.total)::integer
    from public.compras c
    where (c.created_at at time zone 'America/Lima')::date > v_hoy - 7
    group by c.titulo
    order by sum(cardinality(c.asientos)) desc
    limit 4;
end;
$$;

-- Butacas vendidas por función para la fecha de hoy.
create or replace function public.panel_ocupacion_hoy()
returns table (pelicula_id text, funcion_id text, ocupadas integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select public.rol_personal()) is null then
    raise exception 'No tienes permiso para ver esto' using errcode = '42501';
  end if;
  return query
    select a.pelicula_id, a.funcion_id, count(*)::integer
    from public.compra_asientos a
    where a.fecha = (now() at time zone 'America/Lima')::date
    group by a.pelicula_id, a.funcion_id;
end;
$$;

revoke all on function public.panel_compras(integer) from public;
revoke all on function public.panel_buscar_compra(text) from public;
revoke all on function public.panel_marcar_usada(text) from public;
revoke all on function public.panel_ventas_semana() from public;
revoke all on function public.panel_top_peliculas() from public;
revoke all on function public.panel_ocupacion_hoy() from public;
grant execute on function public.panel_compras(integer) to authenticated;
grant execute on function public.panel_buscar_compra(text) to authenticated;
grant execute on function public.panel_marcar_usada(text) to authenticated;
grant execute on function public.panel_ventas_semana() to authenticated;
grant execute on function public.panel_top_peliculas() to authenticated;
grant execute on function public.panel_ocupacion_hoy() to authenticated;

-- ── Cómo dar acceso a una persona ───────────────────────────────────────
-- 1. La persona crea su cuenta en la web (o la creas en Authentication → Users).
-- 2. Ejecuta esto con su correo y el rol que corresponda ('admin' o 'boleteria'):
--
--   insert into public.personal (user_id, rol)
--   select id, 'admin' from auth.users where email = 'correo@ejemplo.com'
--   on conflict (user_id) do update set rol = excluded.rol;
--
-- Para quitarle el acceso:
--
--   delete from public.personal
--   where user_id = (select id from auth.users where email = 'correo@ejemplo.com');
