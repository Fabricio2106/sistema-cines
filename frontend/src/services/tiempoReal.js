import { supabase } from "./supabase";

// Avisos en vivo entre navegadores (patrón Observer). Son solo señales para volver a pedir
// los datos: la información real siempre se lee del servidor, así que una señal falsa o
// perdida no puede mostrar datos incorrectos.

const nombreCanal = (peliculaId, funcionId, fecha) => `ocupacion:${peliculaId}:${funcionId}:${fecha}`;

// Llama a `alCambiar` cuando alguien compra butacas de esa función y fecha.
// Devuelve la función para dejar de escuchar.
export const suscribirOcupacion = (peliculaId, funcionId, fecha, alCambiar) => {
  const canal = supabase
    .channel(nombreCanal(peliculaId, funcionId, fecha))
    .on("broadcast", { event: "compra" }, () => alCambiar())
    .subscribe();
  return () => supabase.removeChannel(canal);
};

// Avisa a quienes miran esa función que hubo una compra. Nunca lanza error: si el aviso
// falla, los demás verán la butaca ocupada al recargar o al intentar comprarla.
export const avisarCompra = (peliculaId, funcionId, fecha) => {
  try {
    const canal = supabase.channel(nombreCanal(peliculaId, funcionId, fecha));
    // Cerrar el canal vuelve a llamar al callback con "CLOSED": sin esta marca se cerraría en bucle.
    let cerrado = false;
    const cerrar = () => {
      if (cerrado) return;
      cerrado = true;
      supabase.removeChannel(canal);
    };
    canal.subscribe((estado) => {
      if (estado === "SUBSCRIBED") {
        canal.send({ type: "broadcast", event: "compra", payload: {} }).finally(cerrar);
      } else if (estado === "CHANNEL_ERROR" || estado === "TIMED_OUT") {
        cerrar();
      }
    });
  } catch {
    /* sin aviso en vivo */
  }
};

// Llama a `alCambiar` cuando cambian películas, funciones o salas en la base de datos.
// Requiere activar Realtime en esas tablas (backend/supabase/realtime.sql); si no está
// activado simplemente no llega ningún aviso.
export const suscribirCartelera = (alCambiar) => {
  const canal = supabase.channel("cartelera");
  for (const tabla of ["peliculas", "funciones", "salas"]) {
    canal.on("postgres_changes", { event: "*", schema: "public", table: tabla }, () => alCambiar());
  }
  canal.subscribe();
  return () => supabase.removeChannel(canal);
};
