import { supabase } from "./supabase";
import { SALAS } from "../data/peliculas";

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
export const asientosOcupados = async (peliculaId, funcionId) => {
  const { data } = await supabase.rpc("asientos_ocupados", {
    p_pelicula_id: peliculaId,
    p_funcion_id: funcionId,
  });
  return data ?? [];
};

export const crearCompra = async ({ pelicula, funcion, asientos }) => {
  const { data, error } = await supabase.rpc("crear_compra", {
    p_pelicula_id: pelicula.id,
    p_titulo: pelicula.titulo,
    p_funcion_id: funcion.id,
    p_hora: funcion.hora,
    p_sala: SALAS[funcion.sala].nombre,
    p_asientos: asientos,
    p_total: asientos.length * funcion.precio,
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
