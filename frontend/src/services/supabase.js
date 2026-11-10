import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sin las variables, createClient lanzaría un error al cargar el módulo y la
// página quedaría en blanco. App revisa `configurado` y muestra un aviso.
export const configurado = Boolean(url && clave);

// Clave pública (publishable): es seguro que viaje en el navegador. La
// protección de los datos está en las reglas RLS de backend/supabase.
export const supabase = createClient(
  url || "https://sin-configurar.invalid",
  clave || "sin-configurar"
);
