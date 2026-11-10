# Backend

El backend es [Supabase](https://supabase.com): autenticación, base de datos Postgres
y reglas de seguridad. No hay un servidor propio que desplegar.

## Contenido

- `supabase/schema.sql`: tablas `compras` y `compra_asientos`, reglas RLS y las funciones
  `crear_compra` y `asientos_ocupados`.

## Cómo aplicarlo

1. Abre el proyecto en Supabase → **SQL Editor → New query**.
2. Pega el contenido de `supabase/schema.sql` y pulsa **Run**.

El script se puede ejecutar más de una vez sin romper nada. Cada cambio futuro en la
base va en un archivo nuevo dentro de `supabase/`, para dejar el historial.
