import { resolver } from "../../services/servicio";
import { supabase } from "../../services/supabase";
import { hoyLima, sumarDias } from "../../utils/fechas";

// "Hoy", "Mañana" o dd/mm, para la columna de la función.
const etiquetaFecha = (iso) => {
  if (iso === hoyLima()) return "Hoy";
  if (iso === sumarDias(hoyLima(), 1)) return "Mañana";
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
};

const aCompra = (fila) => ({
  codigo: fila.codigo,
  cliente: fila.cliente ?? "—",
  pelicula: fila.pelicula,
  funcion: `${etiquetaFecha(fila.fecha)} · ${fila.hora} · ${fila.sala}`,
  asientos: fila.asientos.join(", "),
  total: fila.total,
  usada: fila.usada,
  creadaEn: fila.creada_en,
});

// Las consultas pasan por funciones del servidor (admin.sql): ellas comprueban que quien
// llama sea personal y son las únicas que entregan el nombre del cliente.
export const comprasRepo = {
  listar: async () => {
    const filas = await resolver(supabase.rpc("panel_compras", { p_limite: 100 }));
    return filas.map(aCompra);
  },

  buscarPorCodigo: async (codigo) => {
    const filas = await resolver(supabase.rpc("panel_buscar_compra", { p_codigo: codigo }));
    return filas[0] ? aCompra(filas[0]) : null;
  },

  // El servidor lo hace de forma atómica: si otra persona ya la marcó, responde que ya fue usada.
  marcarUsada: async (codigo) => {
    const filas = await resolver(supabase.rpc("panel_marcar_usada", { p_codigo: codigo }));
    return aCompra(filas[0]);
  },
};
