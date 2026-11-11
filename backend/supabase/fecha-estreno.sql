-- Fecha de estreno de cada película. La tarjeta muestra la etiqueta "Estreno"
-- durante los 14 días siguientes a esa fecha y luego la quita sola.
-- Sin fecha, no muestra etiqueta. Se puede ejecutar más de una vez.

alter table public.peliculas add column if not exists fecha_estreno date;

-- Estrenos actuales. Si alguna fecha real es otra, corrígela aquí o desde
-- Table Editor → peliculas → fecha_estreno.
update public.peliculas set fecha_estreno = '2026-11-05' where id = 'el-gato-con-sombrero';
update public.peliculas set fecha_estreno = '2026-11-06' where id = 'godzilla-minus-zero';
update public.peliculas set fecha_estreno = '2026-11-06' where id = 'pinocho-sin-cuerdas';

-- Esta película ya no cuenta como estreno.
update public.peliculas set fecha_estreno = null where id = 'el-club-de-la-seduccion';
