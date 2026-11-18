import { resolver } from "../../services/servicio";
import { POSTER, normalizarClasificacion, validarPoster } from "../constantes";
import { supabase } from "../../services/supabase";

const aPelicula = (fila) => ({
  id: fila.id,
  titulo: fila.titulo,
  genero: fila.genero,
  clasificacion: normalizarClasificacion(fila.clasificacion),
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

const BUCKET = "posters";

// Sube la imagen con un nombre único (así el navegador nunca muestra una versión vieja en caché)
// y devuelve su dirección pública.
const subirPoster = async (id, archivo) => {
  const motivo = validarPoster(archivo);
  if (motivo) throw new Error(motivo);
  const ruta = `${id}-${Date.now()}.${POSTER.tipos[archivo.type]}`;
  await resolver(
    supabase.storage.from(BUCKET).upload(ruta, archivo, { contentType: archivo.type, cacheControl: "31536000" })
  );
  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
};

const rutaEnBucket = (url) => {
  const coincide = /\/storage\/v1\/object\/public\/posters\/(.+)$/.exec(url ?? "");
  return coincide ? decodeURIComponent(coincide[1]) : null;
};

// Borra una imagen del bucket sin que un fallo afecte a quien guarda (solo queda un archivo suelto).
const borrarPoster = async (url) => {
  const ruta = typeof url === "string" ? rutaEnBucket(url) : null;
  if (!ruta) return;
  try {
    await supabase.storage.from(BUCKET).remove([ruta]);
  } catch {
    /* archivo suelto: no es grave */
  }
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
    const poster = datos.posterArchivo ? await subirPoster(id, datos.posterArchivo) : null;
    try {
      const fila = await resolver(
        supabase
          .from("peliculas")
          .insert({ ...aFila(datos), id, orden: (ultimo[0]?.orden ?? 0) + 1, ...(poster && { poster_url: poster }) })
          .select()
          .single()
      );
      return aPelicula(fila);
    } catch (err) {
      await borrarPoster(poster); // la película no se creó: no deja la imagen huérfana
      throw err;
    }
  },

  actualizar: async (id, cambios) => {
    const poster = cambios.posterArchivo ? await subirPoster(id, cambios.posterArchivo) : null;
    try {
      const fila = await resolver(
        supabase
          .from("peliculas")
          .update({ ...aFila(cambios), ...(poster && { poster_url: poster }) })
          .eq("id", id)
          .select()
          .single()
      );
      if (poster) await borrarPoster(cambios.poster); // el póster anterior ya no se usa
      return aPelicula(fila);
    } catch (err) {
      await borrarPoster(poster);
      throw err;
    }
  },
};
