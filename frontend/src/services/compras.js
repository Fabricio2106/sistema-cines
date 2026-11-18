import { resolver, resolverOComo } from "./servicio";
import { supabase } from "./supabase";
import { avisarCompra } from "./tiempoReal";

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
  const lista = await resolverOComo(
    supabase.rpc("asientos_ocupados", {
      p_pelicula_id: peliculaId,
      p_funcion_id: funcionId,
      p_fecha: fecha,
    }),
    []
  );
  return lista ?? [];
};

// El servidor toma título, hora, sala y precio de la cartelera; el navegador
// solo dice qué función, qué butacas y para qué fecha.
export const crearCompra = async ({ pelicula, funcion, asientos, fecha }) => {
  const data = await resolver(
    supabase.rpc("crear_compra", {
      p_pelicula_id: pelicula.id,
      p_funcion_id: funcion.id,
      p_asientos: asientos,
      p_fecha: fecha,
    })
  );
  // Quienes miran esta función ven las butacas recién compradas sin recargar.
  avisarCompra(pelicula.id, funcion.id, fecha);
  return aCompra(data);
};

// Si la consulta falla o no existe, devuelve null (la pantalla muestra "no encontrada").
export const buscarCompra = async (id) => {
  const data = await resolverOComo(supabase.from("compras").select("*").eq("id", id).maybeSingle(), null);
  return data ? aCompra(data) : null;
};

export const comprasDeUsuario = async () => {
  const data = await resolver(supabase.from("compras").select("*").order("created_at", { ascending: false }));
  return data.map(aCompra);
};
