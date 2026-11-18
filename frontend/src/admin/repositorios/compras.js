import { COMPRAS } from "../datos";
import { crearRepositorioEnMemoria } from "./memoria";

const base = crearRepositorioEnMemoria(COMPRAS, { nuevoId: () => crypto.randomUUID() });

// Las compras las crean los clientes desde la web; el panel solo las consulta y valida.
export const comprasRepo = {
  listar: base.listar,

  buscarPorCodigo: async (codigo) => {
    const compra = base._filas().find((c) => c.codigo === codigo);
    return compra ? structuredClone(compra) : null;
  },

  marcarUsada: async (codigo) => {
    const compra = base._filas().find((c) => c.codigo === codigo);
    if (!compra) throw new Error("No existe esa entrada");
    base._modificar((filas) => filas.map((c) => (c.codigo === codigo ? { ...c, usada: true } : c)));
    return { ...compra, usada: true };
  },
};
