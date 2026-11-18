import { comprasRepo } from "../repositorios/compras";
import { estadisticasRepo } from "../repositorios/estadisticas";
import { funcionesRepo } from "../repositorios/funciones";
import { peliculasRepo } from "../repositorios/peliculas";
import { salasRepo } from "../repositorios/salas";
import { useConsulta, useRepositorio } from "./useConsulta";

export const usePeliculas = () => useRepositorio(peliculasRepo);
export const useFunciones = () => useRepositorio(funcionesRepo);
export const useSalas = () => useRepositorio(salasRepo);

export const useCompras = () => ({
  ...useRepositorio(comprasRepo, ["marcarUsada"]),
  buscarPorCodigo: comprasRepo.buscarPorCodigo,
});

export const useVentasSemana = () => useConsulta(estadisticasRepo.ventasSemana);
export const useTopPeliculas = () => useConsulta(estadisticasRepo.topPeliculas);
export const useOcupacionHoy = () => useConsulta(estadisticasRepo.ocupacionHoy);
