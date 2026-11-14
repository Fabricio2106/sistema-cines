import { supabase } from "./supabase";

const aCompra = (fila) => ({
  id: fila.id,
  codigo: fila.codigo,
  peliculaId: fila.pelicula_id,
  titulo: fila.titulo,
  funcionId: fila.funcion_id,
  hora: fila.hora,
  sala: fila.sala,
  asientos: fila.asientos,
  total: fila.total,
  fecha: fila.fecha,
  creadaEn: fila.created_at,
});

// Si la consulta falla, se devuelve lista vacía: el servidor igual rechaza
// la compra de una butaca ocupada.
export const asientosOcupados = async (peliculaId, funcionId, fecha) => {
  const { data } = await supabase.rpc("asientos_ocupados", {
    p_pelicula_id: peliculaId,
    p_funcion_id: funcionId,
    p_fecha: fecha,
  });
  return data ?? [];
};

// El servidor toma título, hora, sala y precio de la cartelera; el navegador
// solo dice qué función, qué butacas y para qué fecha.
export const crearCompra = async ({ pelicula, funcion, asientos, fecha }) => {
  const { data, error } = await supabase.rpc("crear_compra", {
    p_pelicula_id: pelicula.id,
    p_funcion_id: funcion.id,
    p_asientos: asientos,
    p_fecha: fecha,
  });
  if (error) throw new Error(error.message);
  return aCompra(data);
};

export const buscarCompra = async (id) => {
  const { data } = await supabase.from("compras").select("*").eq("id", id).maybeSingle();
  return data ? aCompra(data) : null;
};

export const comprasDeUsuario = async () => {
  const { data, error } = await supabase
    .from("compras")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(aCompra);
};
