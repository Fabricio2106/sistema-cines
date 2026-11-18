import { resolver } from "../../services/servicio";
import { supabase } from "../../services/supabase";

const aPelicula = (fila) => ({
  id: fila.id,
  titulo: fila.titulo,
  genero: fila.genero,
  clasificacion: fila.clasificacion ?? "",
  estreno: fila.fecha_estreno ?? "",
  trailerUrl: fila.trailer_url ?? "",
  trailer: Boolean(fila.trailer_url),
  poster: fila.poster_url ?? "",
  activa: fila.activa,
});

// Identificador de la URL a partir del título: "El Niño Mágico" → "el-nino-magico".
const crearId = (titulo) =>
  titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Solo se envían los campos que el panel puede editar; descripción, banner y póster no se tocan.
const aFila = (d) => {
  const fila = {};
  if ("titulo" in d) fila.titulo = d.titulo.trim();
  if ("genero" in d) fila.genero = d.genero;
  if ("clasificacion" in d) fila.clasificacion = d.clasificacion.trim() || null;
  if ("estreno" in d) fila.fecha_estreno = d.estreno || null;
  if ("trailerUrl" in d) fila.trailer_url = d.trailerUrl.trim() || null;
  if ("activa" in d) fila.activa = d.activa;
  return fila;
};

export const peliculasRepo = {
  listar: async () => {
    const filas = await resolver(supabase.from("peliculas").select("*").order("orden").order("titulo"));
    return filas.map(aPelicula);
  },

  crear: async (datos) => {
    const id = crearId(datos.titulo);
    if (!id) throw new Error("Escribe un título válido");
    const ultimo = await resolver(
      supabase.from("peliculas").select("orden").order("orden", { ascending: false }).limit(1)
    );
    const fila = await resolver(
      supabase
        .from("peliculas")
        .insert({ ...aFila(datos), id, orden: (ultimo[0]?.orden ?? 0) + 1 })
        .select()
        .single()
    );
    return aPelicula(fila);
  },

  actualizar: async (id, cambios) => {
    const fila = await resolver(supabase.from("peliculas").update(aFila(cambios)).eq("id", id).select().single());
    return aPelicula(fila);
  },
};
