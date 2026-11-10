-- Cartelera de Multicines Iquitos: películas, funciones y salas.
-- Se ejecuta DESPUÉS de schema.sql, en Supabase → SQL Editor → Run.
-- Se puede ejecutar más de una vez: los datos iniciales solo se insertan si
-- no existen, así que no pisa lo que edites en el Table Editor.

-- ── Tablas ──────────────────────────────────────────────────────────────
create table if not exists public.salas (
  id                integer primary key,
  nombre            text not null,
  filas             text[] not null,
  asientos_por_fila integer not null check (asientos_por_fila > 0)
);

create table if not exists public.peliculas (
  id            text primary key,          -- identificador de la URL, ej: exorcismo-el-ritual
  titulo        text not null,
  genero        text not null,
  clasificacion text,                      -- ATP, 14+, 18+… ; vacío = no se muestra insignia
  descripcion   text not null default '',
  poster_url    text,                      -- vertical (2:3); si falta se usa el banner
  banner_url    text,                      -- horizontal; sin banner no sale en el Hero
  orden         integer not null default 0,
  activa        boolean not null default true
);

create table if not exists public.funciones (
  pelicula_id text not null references public.peliculas (id) on delete cascade,
  id          text not null,               -- ej: f1, f2
  hora        text not null check (hora ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  sala_id     integer not null references public.salas (id),
  precio      integer not null check (precio >= 0),
  activa      boolean not null default true,
  primary key (pelicula_id, id)
);

-- ── Seguridad (RLS) ─────────────────────────────────────────────────────
-- Cualquiera puede leer la cartelera; nadie la modifica desde la web.
-- Los cambios se hacen desde el Table Editor de Supabase (tu cuenta).
alter table public.salas enable row level security;
alter table public.peliculas enable row level security;
alter table public.funciones enable row level security;

drop policy if exists "salas: lectura pública" on public.salas;
create policy "salas: lectura pública" on public.salas
  for select to anon, authenticated using (true);

drop policy if exists "peliculas: lectura pública" on public.peliculas;
create policy "peliculas: lectura pública" on public.peliculas
  for select to anon, authenticated using (activa);

drop policy if exists "funciones: lectura pública" on public.funciones;
create policy "funciones: lectura pública" on public.funciones
  for select to anon, authenticated using (activa);

revoke all on public.salas, public.peliculas, public.funciones from anon, authenticated;
grant select on public.salas, public.peliculas, public.funciones to anon, authenticated;

-- ── Datos iniciales (de ejemplo: ajusta horarios y precios a la cartelera real) ──
insert into public.salas (id, nombre, filas, asientos_por_fila) values
  (1, 'Sala 1', array['A','B','C','D','E'], 12),
  (2, 'Sala 2', array['A','B','C','D'], 10)
on conflict (id) do nothing;

insert into public.peliculas (id, titulo, genero, clasificacion, descripcion, poster_url, banner_url, orden) values
  ('el-club-de-la-seduccion', 'El Club de la Seducción', 'Comedia', null, 'No eran la solución… eran el problema. Con Franco Pennano, Rodrigo Viaggio, Marcelo Oxenford y Gianfranco Panesi.',
   '/posters/el-club-de-la-seduccion.jpg', null, 1),
  ('el-gato-con-sombrero', 'El Gato con Sombrero', 'Animación', null, 'Las cosas se van de las manos. Una película de Warner Bros. Animation.',
   '/posters/el-gato-con-sombrero.webp', null, 2),
  ('ekeko', 'Ekeko: El muñeco de la suerte', 'Terror', null, 'La avaricia es un pecado capital.',
   '/posters/ekeko.jpg', null, 3),
  ('madre-siniestra', 'Madre siniestra', 'Terror', null, 'Ella quiere tu corazón. Con Jessica Chastain.',
   '/posters/madre-siniestra.jpg', null, 4),
  ('la-tribu', 'La Tribu', 'Comedia', null, 'No es perfecta, pero es familia. Dirigida por Bruno Ascenzo.',
   '/posters/la-tribu.jpg', null, 5),
  ('godzilla-minus-zero', 'Godzilla Minus Zero', 'Acción', null, 'Guion, dirección y efectos visuales de Takashi Yamazaki.',
   '/posters/godzilla-minus-zero.jpg', null, 6),
  ('pinocho-sin-cuerdas', 'Pinocho sin cuerdas', 'Terror', null, 'Para ser real… alguien debe morir.',
   '/posters/pinocho-sin-cuerdas.jpg', null, 7),
  ('el-poder-de-la-red', 'El poder de la red', 'Drama', null, 'Escrita y dirigida por Aaron Sorkin. Con Jeremy Allen White, Mikey Madison y Jeremy Strong.',
   '/posters/el-poder-de-la-red.jpg', null, 8),
  ('clayface', 'Clayface', 'Terror', null, 'Una película de DC Studios.',
   '/posters/clayface.jpg', null, 9),
  ('street-fighter', 'Street Fighter', 'Acción', null, 'Ready. Set. Fight.',
   '/posters/street-fighter.jpg', null, 10),
  ('caballo-salvaje-nueve', 'Caballo Salvaje Nueve', 'Crimen', null, 'Del director de Tres anuncios por un crimen y Los espíritus de la isla. Con John Malkovich, Sam Rockwell y Steve Buscemi. Escrita y dirigida por Martin McDonagh.',
   '/posters/caballo-salvaje-nueve.webp', null, 11),
  ('exorcismo-el-ritual', 'Exorcismo: El ritual', 'Terror', '16+', 'Basada en hechos reales, la historia que inspiró El Exorcista.',
   '/posters/estreno1.jpg', '/posters/peli1.jpg', 12),
  ('la-hora-de-la-desaparicion', 'La hora de la desaparición', 'Thriller', '16+', 'Del director de Bárbaro. Una noche, a las 2:17 a.m., todos los niños de una misma clase desaparecen.',
   '/posters/estreno4.jpg', '/posters/peli2.jpg', 13),
  ('los-tipos-malos-2', 'Los Tipos Malos 2', 'Animación', 'ATP', 'La banda de DreamWorks vuelve con una nueva aventura.',
   '/posters/estreno2.jpg', '/posters/peli3.jpg', 14),
  ('freakier-friday', 'Freakier Friday', 'Comedia', 'ATP', 'Jamie Lee Curtis y Lindsay Lohan regresan en la secuela de Disney.',
   '/posters/estreno3.jpg', null, 15),
  ('uyariy', 'Uyariy', 'Documental', 'ATP', 'Un poderoso documental sobre las protestas en Juliaca. Una película de Javier Corcuera.',
   null, '/posters/uyayri.jpg', 16),
  ('perusalen', 'Perusalén', 'Comedia', '16+', 'Una sátira hilarante sobre la realidad peruana.',
   null, '/posters/perusalen.jpg', 17),
  ('como-entrenar-a-tu-dragon', 'Cómo Entrenar a tu Dragón', 'Fantasía', 'ATP', 'La épica aventura llega en acción real.',
   null, '/posters/portadadragon.webp', 18)
on conflict (id) do nothing;

insert into public.funciones (pelicula_id, id, hora, sala_id, precio) values
  ('el-club-de-la-seduccion', 'f1', '18:00', 1, 15),
  ('el-club-de-la-seduccion', 'f2', '20:30', 1, 15),
  ('el-gato-con-sombrero', 'f1', '14:00', 2, 15),
  ('el-gato-con-sombrero', 'f2', '16:15', 2, 15),
  ('ekeko', 'f1', '19:15', 2, 18),
  ('ekeko', 'f2', '21:45', 2, 18),
  ('madre-siniestra', 'f1', '18:45', 1, 18),
  ('madre-siniestra', 'f2', '21:15', 1, 18),
  ('la-tribu', 'f1', '15:30', 1, 15),
  ('la-tribu', 'f2', '17:45', 1, 15),
  ('godzilla-minus-zero', 'f1', '17:00', 2, 18),
  ('godzilla-minus-zero', 'f2', '20:00', 2, 18),
  ('pinocho-sin-cuerdas', 'f1', '19:45', 1, 18),
  ('pinocho-sin-cuerdas', 'f2', '22:00', 1, 18),
  ('el-poder-de-la-red', 'f1', '17:30', 1, 15),
  ('clayface', 'f1', '21:00', 2, 18),
  ('street-fighter', 'f1', '16:30', 1, 18),
  ('street-fighter', 'f2', '19:00', 1, 18),
  ('caballo-salvaje-nueve', 'f1', '18:15', 2, 15),
  ('exorcismo-el-ritual', 'f1', '18:30', 1, 18),
  ('exorcismo-el-ritual', 'f2', '21:00', 1, 18),
  ('la-hora-de-la-desaparicion', 'f1', '19:00', 2, 18),
  ('la-hora-de-la-desaparicion', 'f2', '21:30', 2, 18),
  ('los-tipos-malos-2', 'f1', '15:00', 1, 15),
  ('los-tipos-malos-2', 'f2', '17:00', 1, 15),
  ('freakier-friday', 'f1', '16:00', 2, 15),
  ('freakier-friday', 'f2', '20:00', 2, 15),
  ('uyariy', 'f1', '19:30', 2, 12),
  ('perusalen', 'f1', '20:30', 1, 15),
  ('como-entrenar-a-tu-dragon', 'f1', '14:30', 1, 15),
  ('como-entrenar-a-tu-dragon', 'f2', '16:45', 1, 15)
on conflict (pelicula_id, id) do nothing;

-- ── Compra con precio calculado en el servidor ──────────────────────────
-- Reemplaza la versión anterior de schema.sql: ya no confía en el título,
-- la hora, la sala ni el total que envía el navegador. Todo sale de las
-- tablas de arriba, y las butacas se validan contra el tamaño de la sala.
drop function if exists public.crear_compra(text, text, text, text, text, text[], integer);

create or replace function public.crear_compra(
  p_pelicula_id text,
  p_funcion_id  text,
  p_asientos    text[]
)
returns public.compras
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := auth.uid();
  v_hoy      date := (now() at time zone 'America/Lima')::date;
  v_pelicula public.peliculas;
  v_funcion  public.funciones;
  v_sala     public.salas;
  v_compra   public.compras;
  v_asiento  text;
begin
  if v_user is null then
    raise exception 'Debes iniciar sesión para comprar';
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
     p_asientos, v_funcion.precio * array_length(p_asientos, 1), v_hoy)
  returning * into v_compra;

  foreach v_asiento in array p_asientos loop
    begin
      insert into public.compra_asientos (compra_id, pelicula_id, funcion_id, fecha, asiento)
      values (v_compra.id, v_pelicula.id, v_funcion.id, v_hoy, v_asiento);
    exception when unique_violation then
      raise exception 'La butaca % ya no está disponible', v_asiento;
    end;
  end loop;

  return v_compra;
end;
$$;

revoke all on function public.crear_compra(text, text, text[]) from public;
grant execute on function public.crear_compra(text, text, text[]) to authenticated;
