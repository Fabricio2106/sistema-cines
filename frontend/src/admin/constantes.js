export const soles = (n) => `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 0 })}`;

export const ROLES = {
  admin: "Administrador",
  boleteria: "Boletería",
};

export const GENEROS_PELICULA = ["Acción", "Animación", "Comedia", "Crimen", "Drama", "Terror"];

// Clasificación de las películas. `valor` es lo que se guarda y se muestra en la web.
export const CLASIFICACIONES = [
  {
    valor: "APT",
    nombre: "Apto para todos",
    descripcion: "Recomendada para el público en general, incluidos niños y familia, sin violencia fuerte ni lenguaje inapropiado.",
  },
  {
    valor: "+14",
    nombre: "Mayores de 14 años",
    descripcion: "Lenguaje o escenas moderadas. Los menores de 14 años pueden entrar, generalmente con un adulto.",
  },
  {
    valor: "+14 c/DNI",
    nombre: "Mayores de 14 con DNI",
    descripcion: "No entra ningún menor de 14 años, sin excepción, y se pide el DNI en la puerta. Para terror o suspenso intenso.",
  },
  {
    valor: "+18",
    nombre: "Mayores de 18 años",
    descripcion: "Solo adultos: violencia explícita, contenido sexual fuerte o lenguaje adulto. Se pide identificación oficial.",
  },
];

// Lleva los valores antiguos (ATP, 14+, 16+, 18+…) a los de la lista. Un valor desconocido se
// devuelve tal cual para no perderlo. Debe coincidir con backend/supabase/clasificaciones.sql.
export const normalizarClasificacion = (valor) => {
  const texto = String(valor ?? "").trim();
  const t = texto.toUpperCase();
  if (!t) return "";
  if (t.includes("DNI")) return "+14 c/DNI";
  if (["APT", "ATP", "TODOS"].includes(t)) return "APT";
  if (["16+", "+16", "16"].includes(t)) return "+14 c/DNI";
  if (["14+", "+14", "14"].includes(t)) return "+14";
  if (["18+", "+18", "18", "M14", "M18"].includes(t)) return "+18";
  return texto;
};

// Póster de la película: formatos y tamaño que acepta el almacenamiento (backend/supabase/posters.sql).
export const POSTER = {
  tipos: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" },
  maxBytes: 3 * 1024 * 1024,
};

// Devuelve el motivo si el archivo no sirve como póster, o "" si está bien.
export const validarPoster = (archivo) => {
  if (!POSTER.tipos[archivo.type]) return "El póster debe ser una imagen JPG, PNG o WEBP.";
  if (archivo.size > POSTER.maxBytes) return `La imagen pesa ${(archivo.size / 1024 / 1024).toFixed(1)} MB; el máximo es 3 MB.`;
  return "";
};
