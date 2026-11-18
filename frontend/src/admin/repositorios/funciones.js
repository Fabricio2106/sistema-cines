import { FUNCIONES } from "../datos";
import { crearRepositorioEnMemoria } from "./memoria";

const preparar = (fila) => ({
  ...fila,
  sala: Number(fila.sala),
  precio: Number(fila.precio),
  activa: fila.activa ?? true,
});

export const funcionesRepo = crearRepositorioEnMemoria(FUNCIONES, {
  nuevoId: (_datos, filas) => `f${filas.length + 1}`,
  preparar,
});
