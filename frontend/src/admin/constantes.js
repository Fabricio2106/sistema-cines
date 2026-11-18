export const soles = (n) => `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 0 })}`;

export const ROLES = {
  admin: "Administrador",
  boleteria: "Boletería",
};

export const GENEROS_PELICULA = ["Acción", "Animación", "Comedia", "Crimen", "Drama", "Terror"];
