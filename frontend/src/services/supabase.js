import { createClient } from "@supabase/supabase-js";

// Clave pública (publishable): es seguro que viaje en el navegador. La
// protección de los datos está en las reglas RLS de supabase/schema.sql.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
