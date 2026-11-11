import { supabase } from "./supabase";

// Registra un reclamo o queja y devuelve su número. La tabla no se puede leer
// desde el navegador: solo se escribe con esta función del servidor.
export const registrarReclamo = async (d) => {
  const { data, error } = await supabase.rpc("registrar_reclamo", {
    p_tipo: d.tipo,
    p_nombre: d.nombre,
    p_tipo_documento: d.tipoDocumento,
    p_numero_documento: d.numeroDocumento,
    p_correo: d.correo,
    p_telefono: d.telefono,
    p_direccion: d.direccion,
    p_detalle: d.detalle,
    p_pedido: d.pedido,
  });
  if (error) throw new Error("No pudimos registrar tu reclamo. Revisa los datos e inténtalo otra vez.");
  return data;
};
