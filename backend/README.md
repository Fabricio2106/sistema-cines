# Backend

El backend es [Supabase](https://supabase.com): autenticación, base de datos Postgres
y reglas de seguridad. No hay un servidor propio que desplegar.

## Cómo levantarlo

No hay nada que arrancar en tu PC: Supabase corre en la nube y está siempre encendido.
Esta carpeta solo guarda el SQL que define la base de datos.

Para trabajar en el proyecto:

1. **Una sola vez:** aplica los SQL en Supabase (ver "Cómo aplicarlo" más abajo).
2. **Cada vez que programes:** levanta solo el frontend, que se conecta a Supabase por internet.

   ```bash
   cd frontend
   npm install      # solo la primera vez
   npm run dev      # http://localhost:5173
   ```

   El frontend necesita `frontend/.env` con la URL y la clave pública del proyecto
   (ver el README de la raíz).

Para comprobar que el backend responde, abre el panel del proyecto en supabase.com: el
estado debe decir **Healthy**. En el plan gratis, Supabase pausa el proyecto tras una
semana sin uso; si eso pasa, se reactiva desde el panel con **Restore project**.

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
