-- Agrega el enlace del tráiler (YouTube) a cada película. Sin enlace, la web no muestra el botón.
-- Se pega completo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
-- Para cambiar uno después: Table Editor → peliculas → trailer_url.

alter table public.peliculas add column if not exists trailer_url text;

update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=Bi3d1w_Urdk' where id = 'el-gato-con-sombrero';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=gyZd9OVVDG4' where id = 'godzilla-minus-zero';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=DxZT5Z2RD7I' where id = 'pinocho-sin-cuerdas';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=XjhhmaQ2LSI' where id = 'el-club-de-la-seduccion';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=yLI-5xrLyW4' where id = 'ekeko';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=O0e575tMxZQ' where id = 'madre-siniestra';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=Ye8lukNZshI' where id = 'la-tribu';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=8E_KMh-02fQ' where id = 'el-poder-de-la-red';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=0D9f0xOPvHg' where id = 'clayface';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=T9RvKyAGkDc' where id = 'street-fighter';
update public.peliculas set trailer_url = 'https://www.youtube.com/watch?v=MG14cdR2x8E' where id = 'caballo-salvaje-nueve';
