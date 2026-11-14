import { z } from "zod";
import { GENEROS, hoy } from "./datosPersonales";

// Reglas de validación de los formularios (zod). Los mensajes son los que ve el cliente.

const texto = (que, max = 80) =>
  z.string().trim().min(1, `Escribe ${que}`).max(max, `Máximo ${max} caracteres`);

const email = z.string().trim().min(1, "Escribe tu correo").email("El correo no es válido");
const password = z.string().min(6, "La contraseña debe tener al menos 6 caracteres");
const dni = z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos");
const celular = z.string().regex(/^9\d{8}$/, "El celular debe tener 9 dígitos y empezar con 9");
const genero = z.string().refine((g) => GENEROS.includes(g), "Selecciona tu género");
const fechaNacimiento = z
  .string()
  .min(1, "Indica tu fecha de nacimiento")
  .refine((f) => f >= "1900-01-01" && f <= hoy(), "La fecha de nacimiento no es válida");

export const esquemaIngreso = z.object({ email, password });

export const esquemaRegistro = z.object({
  nombre: texto("tu nombre"),
  apellidos: texto("tus apellidos"),
  dni,
  celular,
  fechaNacimiento,
  genero,
  email,
  password,
  aceptaTerminos: z
    .boolean()
    .refine((v) => v, "Debes aceptar los Términos y Condiciones y la Política de Protección de Datos Personales"),
  promociones: z.boolean(),
});

export const esquemaDatos = z.object({
  nombre: texto("tu nombre"),
  apellidos: texto("tus apellidos"),
  celular,
  fechaNacimiento,
  genero,
  promociones: z.boolean(),
});

export const esquemaClave = z
  .object({ clave: password, clave2: z.string().min(1, "Repite la contraseña") })
  .refine((d) => d.clave === d.clave2, { message: "Las contraseñas no coinciden", path: ["clave2"] });

export const esquemaReclamo = z.object({
  tipo: z.enum(["reclamo", "queja"]),
  nombre: z.string().trim().min(2, "Escribe tu nombre completo").max(120, "Máximo 120 caracteres"),
  tipoDocumento: z.enum(["DNI", "CE", "Pasaporte", "RUC"]),
  numeroDocumento: z.string().trim().min(5, "Mínimo 5 caracteres").max(20, "Máximo 20 caracteres"),
  correo: email.max(120, "Máximo 120 caracteres"),
  telefono: z.string().trim().max(20, "Máximo 20 caracteres"),
  direccion: z.string().trim().max(200, "Máximo 200 caracteres"),
  detalle: z.string().trim().min(10, "Cuéntanos con al menos 10 caracteres").max(2000, "Máximo 2000 caracteres"),
  pedido: z.string().trim().min(5, "Indica la solución que esperas").max(1000, "Máximo 1000 caracteres"),
  acepta: z.boolean().refine((v) => v, "Debes aceptar el tratamiento de tus datos"),
});
