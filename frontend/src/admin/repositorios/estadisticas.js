import { TOP_PELICULAS, VENTAS_SEMANA } from "../datos";

export const estadisticasRepo = {
  ventasSemana: async () => structuredClone(VENTAS_SEMANA),
  topPeliculas: async () => structuredClone(TOP_PELICULAS),
};
