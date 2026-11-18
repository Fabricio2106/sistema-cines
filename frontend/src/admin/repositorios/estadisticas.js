import { resolver } from "../../services/servicio";
import { supabase } from "../../services/supabase";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Se usa el mediodía para que el día de la semana no cambie por la zona horaria.
const etiquetaDia = (iso) => DIAS[new Date(`${iso}T12:00:00`).getDay()];

export const estadisticasRepo = {
  ventasSemana: async () => {
    const filas = await resolver(supabase.rpc("panel_ventas_semana"));
    return filas.map((f) => ({ dia: etiquetaDia(f.dia), entradas: f.entradas, ingresos: f.ingresos }));
  },

  topPeliculas: () => resolver(supabase.rpc("panel_top_peliculas")),

  // Butacas vendidas hoy por función: { "pelicula:funcion": cantidad }.
  ocupacionHoy: async () => {
    const filas = await resolver(supabase.rpc("panel_ocupacion_hoy"));
    return Object.fromEntries(filas.map((f) => [`${f.pelicula_id}:${f.funcion_id}`, f.ocupadas]));
  },
};
