import { resolver } from "../../services/servicio";
import { supabase } from "../../services/supabase";

// Las salas son de solo lectura en el panel por ahora (la edición llegará más adelante).
export const salasRepo = {
  listar: async () => {
    const filas = await resolver(supabase.from("salas").select("*").order("id"));
    return filas.map((s) => ({ id: s.id, nombre: s.nombre, filas: s.filas, porFila: s.asientos_por_fila }));
  },
};
