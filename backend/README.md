# Backend

El backend es [Supabase](https://supabase.com): autenticación, base de datos Postgres
y reglas de seguridad. No hay un servidor propio que desplegar.

## Contenido

Se ejecutan en este orden:

1. `supabase/schema.sql`: tablas `compras` y `compra_asientos`, reglas RLS y la función
   `asientos_ocupados`.
2. `supabase/cartelera.sql`: tablas `salas`, `peliculas` y `funciones` con su lectura
   pública, datos iniciales de ejemplo y la función `crear_compra`, que calcula el precio
   en el servidor.

## Cómo aplicarlo

1. Abre el proyecto en Supabase → **SQL Editor → New query**.
2. Pega `schema.sql` y pulsa **Run**. Luego repite con `cartelera.sql`.

Ambos se pueden ejecutar más de una vez sin romper nada. Cada cambio futuro en la base va
en un archivo nuevo dentro de `supabase/`, para dejar el historial.

## Cambiar la cartelera sin tocar código

Desde **Table Editor** en Supabase:

- **`peliculas`**: agrega una fila con `id` (sin espacios, ej: `mi-pelicula`), título,
  género, clasificación y las rutas de imagen. Pon `activa = false` para ocultarla.
- **`funciones`**: una fila por horario con `pelicula_id`, `id` (f1, f2…), `hora` (`18:30`),
  `sala_id` y `precio`.
- **`salas`**: filas (`{A,B,C}`) y butacas por fila.

Las imágenes están en `frontend/public/posters/`; en `poster_url` y `banner_url` se guarda
la ruta (`/posters/archivo.jpg`) o una URL completa. El póster es vertical; el banner,
horizontal. Sin banner, la película no aparece en el carrusel de inicio.
