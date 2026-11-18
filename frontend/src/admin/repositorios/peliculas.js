import { PELICULAS } from "../datos";
import { crearRepositorioEnMemoria } from "./memoria";

const crearId = (titulo) =>
  titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// `trailerUrl` solo existe mientras se edita; en la lista se guarda si tiene tráiler o no.
const preparar = ({ trailerUrl, ...fila }, anterior) => ({
  ...fila,
  trailer: Boolean(trailerUrl) || Boolean(anterior?.trailer),
});

export const peliculasRepo = crearRepositorioEnMemoria(PELICULAS, {
  nuevoId: ({ titulo }) => crearId(titulo),
  preparar,
});
