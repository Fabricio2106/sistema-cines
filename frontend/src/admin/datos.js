// MAQUETA: datos de ejemplo para el panel de administración. Nada de esto viene de Supabase.

export const soles = (n) => `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 0 })}`;

export const ROLES = {
  admin: "Administrador",
  boleteria: "Boletería",
};

export const GENEROS_PELICULA = ["Acción", "Animación", "Comedia", "Crimen", "Drama", "Terror"];

export const PELICULAS = [
  { id: "el-club-de-la-seduccion", titulo: "El Club de la Seducción", genero: "Comedia", clasificacion: "", estreno: "2026-10-30", trailer: true, activa: true, poster: "/posters/el-club-de-la-seduccion.jpg" },
  { id: "el-gato-con-sombrero", titulo: "El Gato con Sombrero", genero: "Animación", clasificacion: "", estreno: "2026-11-05", trailer: true, activa: true, poster: "/posters/el-gato-con-sombrero.webp" },
  { id: "ekeko", titulo: "Ekeko: El muñeco de la suerte", genero: "Terror", clasificacion: "14+", estreno: "2026-11-06", trailer: true, activa: true, poster: "/posters/ekeko.jpg" },
  { id: "madre-siniestra", titulo: "Madre siniestra", genero: "Terror", clasificacion: "", estreno: "", trailer: true, activa: true, poster: "/posters/madre-siniestra.jpg" },
  { id: "la-tribu", titulo: "La Tribu", genero: "Comedia", clasificacion: "", estreno: "", trailer: true, activa: true, poster: "/posters/la-tribu.jpg" },
  { id: "godzilla-minus-zero", titulo: "Godzilla Minus Zero", genero: "Acción", clasificacion: "", estreno: "2026-11-06", trailer: true, activa: true, poster: "/posters/godzilla-minus-zero.jpg" },
  { id: "pinocho-sin-cuerdas", titulo: "Pinocho sin cuerdas", genero: "Terror", clasificacion: "18+", estreno: "2026-11-06", trailer: true, activa: true, poster: "/posters/pinocho-sin-cuerdas.jpg" },
  { id: "el-poder-de-la-red", titulo: "El poder de la red", genero: "Drama", clasificacion: "", estreno: "", trailer: true, activa: true, poster: "/posters/el-poder-de-la-red.jpg" },
  { id: "clayface", titulo: "Clayface", genero: "Terror", clasificacion: "", estreno: "", trailer: true, activa: false, poster: "/posters/clayface.jpg" },
  { id: "street-fighter", titulo: "Street Fighter", genero: "Acción", clasificacion: "", estreno: "", trailer: true, activa: true, poster: "/posters/street-fighter.jpg" },
  { id: "caballo-salvaje-nueve", titulo: "Caballo Salvaje Nueve", genero: "Crimen", clasificacion: "", estreno: "", trailer: true, activa: true, poster: "/posters/caballo-salvaje-nueve.webp" },
];

export const SALAS = [
  { id: 1, nombre: "Sala 1", filas: ["A", "B", "C", "D", "E"], porFila: 12 },
  { id: 2, nombre: "Sala 2", filas: ["A", "B", "C", "D"], porFila: 10 },
];

export const FUNCIONES = [
  { id: "f1", pelicula: "El Club de la Seducción", hora: "18:00", sala: 1, precio: 15, activa: true },
  { id: "f2", pelicula: "El Club de la Seducción", hora: "20:30", sala: 1, precio: 15, activa: true },
  { id: "f3", pelicula: "El Gato con Sombrero", hora: "14:00", sala: 2, precio: 15, activa: true },
  { id: "f4", pelicula: "El Gato con Sombrero", hora: "16:15", sala: 2, precio: 15, activa: true },
  { id: "f5", pelicula: "Ekeko: El muñeco de la suerte", hora: "19:15", sala: 2, precio: 18, activa: true },
  { id: "f6", pelicula: "Godzilla Minus Zero", hora: "17:00", sala: 2, precio: 18, activa: true },
  { id: "f7", pelicula: "Pinocho sin cuerdas", hora: "19:45", sala: 1, precio: 18, activa: true },
  { id: "f8", pelicula: "Pinocho sin cuerdas", hora: "22:00", sala: 1, precio: 18, activa: false },
  { id: "f9", pelicula: "Street Fighter", hora: "16:30", sala: 1, precio: 18, activa: true },
];

export const VENTAS_SEMANA = [
  { dia: "Jue", entradas: 96, ingresos: 1590 },
  { dia: "Vie", entradas: 142, ingresos: 2380 },
  { dia: "Sáb", entradas: 188, ingresos: 3150 },
  { dia: "Dom", entradas: 171, ingresos: 2860 },
  { dia: "Lun", entradas: 64, ingresos: 1040 },
  { dia: "Mar", entradas: 71, ingresos: 1170 },
  { dia: "Mié", entradas: 118, ingresos: 1960 },
];

export const TOP_PELICULAS = [
  { titulo: "Pinocho sin cuerdas", entradas: 214, ingresos: 3852 },
  { titulo: "Godzilla Minus Zero", entradas: 187, ingresos: 3366 },
  { titulo: "El Club de la Seducción", entradas: 162, ingresos: 2430 },
  { titulo: "El Gato con Sombrero", entradas: 139, ingresos: 2085 },
];

export const COMPRAS = [
  { codigo: "A1B2C3D4", cliente: "Cliente de ejemplo 01", pelicula: "Pinocho sin cuerdas", funcion: "Hoy · 19:45 · Sala 1", asientos: "C5, C6", total: 36, usada: false },
  { codigo: "F7G8H9J2", cliente: "Cliente de ejemplo 02", pelicula: "Godzilla Minus Zero", funcion: "Hoy · 17:00 · Sala 2", asientos: "B3", total: 18, usada: true },
  { codigo: "K3L4M5N6", cliente: "Cliente de ejemplo 03", pelicula: "El Club de la Seducción", funcion: "Hoy · 20:30 · Sala 1", asientos: "D1, D2, D3", total: 45, usada: false },
  { codigo: "P9Q8R7S6", cliente: "Cliente de ejemplo 04", pelicula: "El Gato con Sombrero", funcion: "Mañana · 14:00 · Sala 2", asientos: "A4, A5", total: 30, usada: false },
  { codigo: "T2U3V4W5", cliente: "Cliente de ejemplo 05", pelicula: "Ekeko: El muñeco de la suerte", funcion: "Hoy · 19:15 · Sala 2", asientos: "C8", total: 18, usada: true },
  { codigo: "X6Y7Z8A9", cliente: "Cliente de ejemplo 06", pelicula: "Street Fighter", funcion: "Hoy · 16:30 · Sala 1", asientos: "E10, E11", total: 36, usada: false },
];
