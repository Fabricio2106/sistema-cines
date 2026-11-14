-- Permite comprar entradas y ver butacas ocupadas para una fecha elegida:
-- de hoy hasta 6 días después (hora de Lima). Va DESPUÉS de schema.sql y cartelera.sql.
-- Se pega completo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
--
-- Las tablas ya guardan la fecha por butaca (compra_asientos.fecha), así que no cambian.
-- Las funciones de 2 y 3 argumentos se conservan como atajos de "hoy", para que la web
-- anterior siga funcionando mientras se publica la nueva.

-- ── Butacas ocupadas de una función en una fecha ─────────────────────────
create or replace function public.asientos_ocupados(p_pelicula_id text, p_funcion_id text, p_fecha date)
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
    and fecha = p_fecha;
$$;

create or replace function public.asientos_ocupados(p_pelicula_id text, p_funcion_id text)
returns text[]
language sql
stable
security definer
set search_path = ''
as $$
  select public.asientos_ocupados(p_pelicula_id, p_funcion_id, (now() at time zone 'America/Lima')::date);
$$;

revoke all on function public.asientos_ocupados(text, text, date) from public;
grant execute on function public.asientos_ocupados(text, text, date) to anon, authenticated;

-- ── Compra con fecha ─────────────────────────────────────────────────────
-- Igual que antes (precio y butacas validados en el servidor), más:
--   · la fecha debe estar entre hoy y 6 días después;
--   · si la fecha es hoy, la función no puede haber empezado ya.
create or replace function public.crear_compra(
  p_pelicula_id text,
  p_funcion_id  text,
  p_asientos    text[],
  p_fecha       date
)
returns public.compras
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := auth.uid();
  v_ahora    timestamp := now() at time zone 'America/Lima';
  v_hoy      date := v_ahora::date;
  v_pelicula public.peliculas;
  v_funcion  public.funciones;
  v_sala     public.salas;
  v_compra   public.compras;
  v_asiento  text;
begin
  if v_user is null then
    raise exception 'Debes iniciar sesión para comprar';
  end if;
  if p_fecha is null or p_fecha < v_hoy or p_fecha > v_hoy + 6 then
    raise exception 'La fecha elegida no está disponible';
  end if;
  if coalesce(array_length(p_asientos, 1), 0) = 0 then
    raise exception 'Elige al menos una butaca';
  end if;
  if (select count(distinct a) from unnest(p_asientos) as a) <> array_length(p_asientos, 1) then
    raise exception 'Hay butacas repetidas';
  end if;

  select * into v_pelicula from public.peliculas where id = p_pelicula_id and activa;
  select * into v_funcion from public.funciones
    where pelicula_id = p_pelicula_id and id = p_funcion_id and activa;
  if v_pelicula.id is null or v_funcion.id is null then
    raise exception 'La función no está disponible';
  end if;
  if p_fecha = v_hoy and v_funcion.hora::time <= v_ahora::time then
    raise exception 'Esa función de hoy ya empezó. Elige otro horario o fecha';
  end if;
  select * into v_sala from public.salas where id = v_funcion.sala_id;

  foreach v_asiento in array p_asientos loop
    if v_asiento !~ '^[A-Z][0-9]{1,2}$' then
      raise exception 'La butaca % no es válida', v_asiento;
    end if;
    if not (left(v_asiento, 1) = any (v_sala.filas))
       or substr(v_asiento, 2)::integer not between 1 and v_sala.asientos_por_fila then
      raise exception 'La butaca % no existe en la sala', v_asiento;
    end if;
  end loop;

  insert into public.compras
    (user_id, codigo, pelicula_id, titulo, funcion_id, hora, sala, asientos, total, fecha)
  values
    (v_user, upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
     v_pelicula.id, v_pelicula.titulo, v_funcion.id, v_funcion.hora, v_sala.nombre,
     p_asientos, v_funcion.precio * array_length(p_asientos, 1), p_fecha)
  returning * into v_compra;

  foreach v_asiento in array p_asientos loop
    begin
      insert into public.compra_asientos (compra_id, pelicula_id, funcion_id, fecha, asiento)
      values (v_compra.id, v_pelicula.id, v_funcion.id, p_fecha, v_asiento);
    exception when unique_violation then
      raise exception 'La butaca % ya no está disponible', v_asiento;
    end;
  end loop;

  return v_compra;
end;
$$;

revoke all on function public.crear_compra(text, text, text[], date) from public;
grant execute on function public.crear_compra(text, text, text[], date) to authenticated;

-- Atajo de "hoy" con la firma anterior.
create or replace function public.crear_compra(
  p_pelicula_id text,
  p_funcion_id  text,
  p_asientos    text[]
)
returns public.compras
language sql
security invoker
set search_path = ''
as $$
  select public.crear_compra(p_pelicula_id, p_funcion_id, p_asientos, (now() at time zone 'America/Lima')::date);
$$;

revoke all on function public.crear_compra(text, text, text[]) from public;
grant execute on function public.crear_compra(text, text, text[]) to authenticated;
