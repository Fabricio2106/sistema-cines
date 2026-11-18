import { SALAS } from "../datos";

// Las salas son de solo lectura por ahora (la edición llegará al conectar el panel).
export const salasRepo = {
  listar: async () => structuredClone(SALAS),
};
