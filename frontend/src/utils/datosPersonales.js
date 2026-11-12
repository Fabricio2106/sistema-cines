export const GENEROS = ["Femenino", "Masculino", "Otro", "Prefiero no decirlo"];

export const hoy = () => new Date().toISOString().slice(0, 10);

// Devuelve un mensaje de error o "" si los datos son válidos.
export const validarDatosPersonales = ({ nombre, apellidos, dni, fechaNacimiento, genero, celular }) => {
  if (!nombre.trim()) return "Escribe tu nombre";
  if (!apellidos.trim()) return "Escribe tus apellidos";
  if (!/^\d{8}$/.test(dni)) return "El DNI debe tener 8 dígitos";
  if (!fechaNacimiento) return "Indica tu fecha de nacimiento";
  if (fechaNacimiento > hoy() || fechaNacimiento < "1900-01-01") return "La fecha de nacimiento no es válida";
  if (!GENEROS.includes(genero)) return "Selecciona tu género";
  if (!/^9\d{8}$/.test(celular)) return "El celular debe tener 9 dígitos y empezar con 9";
  return "";
};

export const soloDigitos = (valor, max) => valor.replace(/\D/g, "").slice(0, max);
