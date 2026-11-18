// Punto único para convertir la respuesta de Supabase en datos o en un error con mensaje
// legible. Los servicios usan `resolver` en vez de revisar `{ data, error }` cada uno.

const MENSAJES = {
  "Invalid login credentials": "Correo o contraseña incorrectos",
  "User already registered": "Ya existe una cuenta con ese correo",
  "Email not confirmed": "Confirma tu correo antes de ingresar",
};

const SIN_CONEXION = "No hay conexión con el servidor. Revisa tu internet e inténtalo otra vez.";

// Los navegadores reportan la falta de red con textos distintos (Chrome, Firefox, Safari).
const esErrorDeRed = (texto) => /failed to fetch|networkerror|load failed/i.test(texto);

export class ErrorServicio extends Error {
  constructor(mensaje, causa) {
    super(mensaje);
    this.name = "ErrorServicio";
    this.causa = causa;
  }
}

// Errores de Postgres por código: 23505 = valor repetido, 42501 = sin permiso (RLS o función).
const MENSAJES_POR_CODIGO = {
  23505: "Ya existe un registro igual",
  42501: "No tienes permiso para hacer esto",
  PGRST202: "Falta una configuración en la base de datos: ejecuta backend/supabase/admin.sql en Supabase",
};

const traducir = (error, mensajeFijo) => {
  if (mensajeFijo) return mensajeFijo;
  const texto = error?.message ?? "";
  if (esErrorDeRed(texto)) return SIN_CONEXION;
  if (MENSAJES_POR_CODIGO[error?.code]) return MENSAJES_POR_CODIGO[error.code];
  return MENSAJES[texto] ?? (texto || "Ocurrió un error inesperado");
};

// Espera una consulta de Supabase y devuelve `data`. Si falla (error de Supabase o de red)
// lanza un `ErrorServicio`. Con `mensaje` se reemplaza el texto del servidor por uno fijo,
// útil cuando el mensaje original no debe llegar al usuario.
export const resolver = async (consulta, { mensaje } = {}) => {
  let respuesta;
  try {
    respuesta = await consulta;
  } catch (err) {
    throw new ErrorServicio(traducir(err, mensaje), err);
  }
  if (respuesta.error) throw new ErrorServicio(traducir(respuesta.error, mensaje), respuesta.error);
  return respuesta.data;
};

// Para consultas de apoyo que no deben romper la pantalla: si fallan, devuelve `porDefecto`
// y deja el error en la consola.
export const resolverOComo = async (consulta, porDefecto) => {
  try {
    return await resolver(consulta);
  } catch (err) {
    console.warn("[servicio]", err.message);
    return porDefecto;
  }
};
