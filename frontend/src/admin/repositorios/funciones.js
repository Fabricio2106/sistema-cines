import { resolver } from "../../services/servicio";
import { supabase } from "../../services/supabase";

// En la base una función se identifica por (pelicula_id, id). Para el panel se junta en un
// solo identificador "pelicula:funcion"; las ids de película nunca llevan ":".
const aFuncion = (fila) => ({
  id: `${fila.pelicula_id}:${fila.id}`,
  peliculaId: fila.pelicula_id,
  pelicula: fila.peliculas?.titulo ?? fila.pelicula_id,
  hora: fila.hora,
  sala: fila.sala_id,
  precio: fila.precio,
  activa: fila.activa,
});

const separar = (id) => {
  const [peliculaId, funcionId] = id.split(":");
  return { peliculaId, funcionId };
};

// Siguiente identificador libre de la película: f1, f2, f3…
const siguienteId = async (peliculaId) => {
  const existentes = await resolver(supabase.from("funciones").select("id").eq("pelicula_id", peliculaId));
  const numeros = existentes.map((f) => Number(/^f(\d+)$/.exec(f.id)?.[1] ?? 0));
  return `f${Math.max(0, ...numeros) + 1}`;
};

export const funcionesRepo = {
  listar: async () => {
    const filas = await resolver(
      supabase.from("funciones").select("*, peliculas(titulo)").order("pelicula_id").order("hora")
    );
    return filas.map(aFuncion);
  },

  crear: async ({ peliculaId, hora, sala, precio, activa = true }) => {
    const fila = await resolver(
      supabase
        .from("funciones")
        .insert({
          pelicula_id: peliculaId,
          id: await siguienteId(peliculaId),
          hora,
          sala_id: Number(sala),
          precio: Number(precio),
          activa,
        })
        .select("*, peliculas(titulo)")
        .single()
    );
    return aFuncion(fila);
  },

  actualizar: async (id, cambios) => {
    const { peliculaId, funcionId } = separar(id);
    const fila = {};
    if ("hora" in cambios) fila.hora = cambios.hora;
    if ("sala" in cambios) fila.sala_id = Number(cambios.sala);
    if ("precio" in cambios) fila.precio = Number(cambios.precio);
    if ("activa" in cambios) fila.activa = cambios.activa;
    const actualizada = await resolver(
      supabase
        .from("funciones")
        .update(fila)
        .eq("pelicula_id", peliculaId)
        .eq("id", funcionId)
        .select("*, peliculas(titulo)")
        .single()
    );
    return aFuncion(actualizada);
  },
};
