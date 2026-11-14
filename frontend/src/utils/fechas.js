// Las fechas de las funciones se manejan como texto "AAAA-MM-DD" en hora de Lima,
// igual que la base de datos. La web permite elegir de hoy a 6 días después.
export const DIAS_ADELANTE = 6;

const FECHA_LIMA = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Lima",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const HORA_LIMA = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/Lima",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const hoyLima = () => FECHA_LIMA.format(new Date());

export const aFecha = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
};

export const aIso = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

export const sumarDias = (iso, dias) => {
  const f = aFecha(iso);
  f.setDate(f.getDate() + dias);
  return aIso(f);
};

export const ultimaFecha = () => sumarDias(hoyLima(), DIAS_ADELANTE);

export const esFechaValida = (iso) =>
  typeof iso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(iso) && iso >= hoyLima() && iso <= ultimaFecha();

// Una función de hoy que ya empezó no se puede comprar.
export const funcionYaEmpezo = (iso, hora) => iso === hoyLima() && hora <= HORA_LIMA.format(new Date());

export const textoFecha = (iso) =>
  aFecha(iso).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
