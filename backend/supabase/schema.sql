-- Esquema de Multicines Iquitos (compras y butacas). Va primero; luego cartelera.sql.
-- Se pega completo en Supabase → SQL Editor → Run.
-- Se puede ejecutar más de una vez sin romper nada.

-- ── Tablas ──────────────────────────────────────────────────────────────
create table if not exists public.compras (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  codigo      text not null,
  pelicula_id text not null,
  titulo      text not null,
  funcion_id  text not null,
  hora        text not null,
  sala        text not null,
  asientos    text[] not null,
  total       integer not null check (total >= 0),
  fecha       date not null,
  created_at  timestamptz not null default now()
);

-- Una fila por butaca vendida. La restricción única impide vender dos
-- veces la misma butaca en la misma función y día, aunque dos personas
-- compren al mismo tiempo.
create table if not exists public.compra_asientos (
  compra_id   uuid not null references public.compras (id) on delete cascade,
  pelicula_id text not null,
  funcion_id  text not null,
  fecha       date not null,
  asiento     text not null,
  unique (pelicula_id, funcion_id, fecha, asiento)
);

create index if not exists compras_user_idx on public.compras (user_id, created_at desc);

-- ── Seguridad (RLS) ─────────────────────────────────────────────────────
alter table public.compras enable row level security;
alter table public.compra_asientos enable row level security;

-- Cada usuario solo lee sus propias compras. Nadie inserta directo:
-- se compra únicamente con la función crear_compra().
drop policy if exists "compras: leer propias" on public.compras;
create policy "compras: leer propias" on public.compras
  for select to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.compras from anon, authenticated;
revoke all on public.compra_asientos from anon, authenticated;
grant select on public.compras to authenticated;

-- ── Funciones ───────────────────────────────────────────────────────────
-- Butacas ocupadas de una función hoy (hora de Lima). Visible sin sesión,
-- pero solo devuelve los códigos de butaca, nunca datos de personas.
create or replace function public.asientos_ocupados(p_pelicula_id text, p_funcion_id text)
returns text[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(asiento), '{}')
  from public.compra_asientos
  where pelicula_id = p_pelicula_id
    and funcion_id = p_funcion_id
    and fecha = (now() at time zone 'America/Lima')::date;
$$;

-- La función crear_compra() vive en cartelera.sql, porque calcula el precio
-- con los datos de las funciones.

revoke all on function public.asientos_ocupados(text, text) from public;
grant execute on function public.asientos_ocupados(text, text) to anon, authenticated;
