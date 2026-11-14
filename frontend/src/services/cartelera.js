import { supabase } from "./supabase";

const aPelicula = (fila) => ({
  id: fila.id,
  titulo: fila.titulo,
  genero: fila.genero,
  clasificacion: fila.clasificacion,
  descripcion: fila.descripcion,
  poster: fila.poster_url,
  banner: fila.banner_url,
  trailer: fila.trailer_url ?? null,
  fechaEstreno: fila.fecha_estreno ?? null,
  funciones: (fila.funciones ?? [])
    .filter((f) => f.activa)
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .map((f) => ({ id: f.id, hora: f.hora, sala: f.sala_id, precio: f.precio })),
});

// Devuelve las películas activas con sus funciones y el mapa de salas por id.
export const cargarCartelera = async () => {
  const [peliculas, salas] = await Promise.all([
    supabase.from("peliculas").select("*, funciones(*)").eq("activa", true).order("orden"),
    supabase.from("salas").select("*"),
  ]);
  const error = peliculas.error ?? salas.error;
  if (error) throw new Error(error.message);

  return {
    peliculas: peliculas.data.map(aPelicula),
    salas: Object.fromEntries(
      salas.data.map((s) => [
        s.id,
        { nombre: s.nombre, filas: s.filas, asientosPorFila: s.asientos_por_fila },
      ])
    ),
  };
};
