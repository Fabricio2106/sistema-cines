-- Banners horizontales para el carrusel de inicio. El carrusel solo muestra las
-- películas que tienen banner_url. Se puede ejecutar más de una vez.

update public.peliculas set banner_url = '/banners/el-club-de-la-seduccion.jpg' where id = 'el-club-de-la-seduccion';
update public.peliculas set banner_url = '/banners/el-gato-con-sombrero.jpg'   where id = 'el-gato-con-sombrero';
update public.peliculas set banner_url = '/banners/ekeko.jpg'                  where id = 'ekeko';
update public.peliculas set banner_url = '/banners/madre-siniestra.jpg'        where id = 'madre-siniestra';
update public.peliculas set banner_url = '/banners/godzilla-minus-zero.jpg'    where id = 'godzilla-minus-zero';
