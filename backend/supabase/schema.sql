-- Esquema de Multicines Iquitos. Se pega completo en Supabase → SQL Editor → Run.
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

-- Crea la compra y reserva las butacas en una sola transacción.
create or replace function public.crear_compra(
  p_pelicula_id text,
  p_titulo      text,
  p_funcion_id  text,
  p_hora        text,
  p_sala        text,
  p_asientos    text[],
  p_total       integer
)
returns public.compras
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := auth.uid();
  v_hoy   date := (now() at time zone 'America/Lima')::date;
  v_compra public.compras;
  v_asiento text;
begin
  if v_user is null then
    raise exception 'Debes iniciar sesión para comprar';
  end if;
  if coalesce(array_length(p_asientos, 1), 0) = 0 then
    raise exception 'Elige al menos una butaca';
  end if;

  insert into public.compras
    (user_id, codigo, pelicula_id, titulo, funcion_id, hora, sala, asientos, total, fecha)
  values
    (v_user, upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
     p_pelicula_id, p_titulo, p_funcion_id, p_hora, p_sala, p_asientos, p_total, v_hoy)
  returning * into v_compra;

  foreach v_asiento in array p_asientos loop
    begin
      insert into public.compra_asientos (compra_id, pelicula_id, funcion_id, fecha, asiento)
      values (v_compra.id, p_pelicula_id, p_funcion_id, v_hoy, v_asiento);
    exception when unique_violation then
      raise exception 'La butaca % ya no está disponible', v_asiento;
    end;
  end loop;

  return v_compra;
end;
$$;

revoke all on function public.asientos_ocupados(text, text) from public;
revoke all on function public.crear_compra(text, text, text, text, text, text[], integer) from public;
grant execute on function public.asientos_ocupados(text, text) to anon, authenticated;
grant execute on function public.crear_compra(text, text, text, text, text, text[], integer) to authenticated;
