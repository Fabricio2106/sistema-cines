-- Quita de la cartelera las 7 películas de ejemplo antiguas y deja solo las de los
-- pósters reales. No se borran: se marcan como inactivas, así que se pueden
-- reactivar con `update public.peliculas set activa = true where id = '...'`.
-- Se puede ejecutar más de una vez.

update public.peliculas
set activa = false
where id in (
  'los-tipos-malos-2',
  'exorcismo-el-ritual',
  'la-hora-de-la-desaparicion',
  'freakier-friday',
  'uyariy',
  'perusalen',
  'como-entrenar-a-tu-dragon'
);
