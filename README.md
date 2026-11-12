# Cinerama Pacífico

Sitio web de cartelera y venta de entradas.

```
frontend/   Aplicación React + Vite + Tailwind (lo que se publica en Vercel)
backend/    Base de datos y reglas de seguridad en Supabase
```

## Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build
```

Crea `frontend/.env` con (los valores están en Supabase → Project Settings → API Keys):

```
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Usa solo la clave pública (publishable). Nunca pongas aquí la `secret` ni la `service_role`.

## Backend

Ver [backend/README.md](backend/README.md).

## Despliegue en Vercel

En Settings → General → **Root Directory** debe decir `frontend`. Las dos variables
de entorno de arriba se cargan en Settings → Environment Variables.
