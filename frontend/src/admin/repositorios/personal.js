import { sesionActual } from "../../services/auth";
import { resolver } from "../../services/servicio";
import { supabase } from "../../services/supabase";

// Rol de quien tiene la sesión abierta ('admin', 'boleteria') o null si no es personal.
// La respuesta viene del servidor (tabla `personal`); el navegador no decide quién es admin.
export const rolDePersonal = async () => {
  if (!(await sesionActual())) return null;
  return (await resolver(supabase.rpc("rol_personal"))) ?? null;
};
