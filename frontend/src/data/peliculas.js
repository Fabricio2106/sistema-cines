import exorcismoPoster from "../assets/estreno1.jpg";
import exorcismoBanner from "../assets/peli1.jpg";
import tiposMalosPoster from "../assets/estreno2.jpg";
import tiposMalosBanner from "../assets/peli3.jpg";
import freakierPoster from "../assets/estreno3.jpg";
import desaparicionPoster from "../assets/estreno4.jpg";
import desaparicionBanner from "../assets/peli2.jpg";
import uyariyBanner from "../assets/uyayri.jpg";
import perusalenBanner from "../assets/perusalen.jpg";
import dragonBanner from "../assets/portadadragon.webp";

// Datos de ejemplo: horarios, salas, precios y clasificación deben
// confirmarse con la cartelera real antes de publicar.
// `poster` es vertical (2:3); `banner` es horizontal. Si falta el póster,
// las tarjetas usan el banner. Sin banner, la película no sale en el Hero.
export const SALAS = {
  1: { nombre: "Sala 1", filas: ["A", "B", "C", "D", "E"], asientosPorFila: 12 },
  2: { nombre: "Sala 2", filas: ["A", "B", "C", "D"], asientosPorFila: 10 },
};

export const peliculas = [
  {
    id: "exorcismo-el-ritual",
    titulo: "Exorcismo: El ritual",
    genero: "Terror",
    clasificacion: "16+",
    poster: exorcismoPoster,
    banner: exorcismoBanner,
    descripcion: "Basada en hechos reales, la historia que inspiró El Exorcista.",
    funciones: [
      { id: "f1", hora: "18:30", sala: 1, precio: 18 },
      { id: "f2", hora: "21:00", sala: 1, precio: 18 },
    ],
  },
  {
    id: "la-hora-de-la-desaparicion",
    titulo: "La hora de la desaparición",
    genero: "Thriller",
    clasificacion: "16+",
    poster: desaparicionPoster,
    banner: desaparicionBanner,
    descripcion:
      "Del director de Bárbaro. Una noche, a las 2:17 a.m., todos los niños de una misma clase desaparecen.",
    funciones: [
      { id: "f1", hora: "19:00", sala: 2, precio: 18 },
      { id: "f2", hora: "21:30", sala: 2, precio: 18 },
    ],
  },
  {
    id: "los-tipos-malos-2",
    titulo: "Los Tipos Malos 2",
    genero: "Animación",
    clasificacion: "ATP",
    poster: tiposMalosPoster,
    banner: tiposMalosBanner,
    descripcion: "La banda de DreamWorks vuelve con una nueva aventura.",
    funciones: [
      { id: "f1", hora: "15:00", sala: 1, precio: 15 },
      { id: "f2", hora: "17:00", sala: 1, precio: 15 },
    ],
  },
  {
    id: "freakier-friday",
    titulo: "Freakier Friday",
    genero: "Comedia",
    clasificacion: "ATP",
    poster: freakierPoster,
    banner: null,
    descripcion: "Jamie Lee Curtis y Lindsay Lohan regresan en la secuela de Disney.",
    funciones: [
      { id: "f1", hora: "16:00", sala: 2, precio: 15 },
      { id: "f2", hora: "20:00", sala: 2, precio: 15 },
    ],
  },
  {
    id: "uyariy",
    titulo: "Uyariy",
    genero: "Documental",
    clasificacion: "ATP",
    poster: null,
    banner: uyariyBanner,
    descripcion: "Un poderoso documental sobre las protestas en Juliaca. Una película de Javier Corcuera.",
    funciones: [{ id: "f1", hora: "19:30", sala: 2, precio: 12 }],
  },
  {
    id: "perusalen",
    titulo: "Perusalén",
    genero: "Comedia",
    clasificacion: "16+",
    poster: null,
    banner: perusalenBanner,
    descripcion: "Una sátira hilarante sobre la realidad peruana.",
    funciones: [{ id: "f1", hora: "20:30", sala: 1, precio: 15 }],
  },
  {
    id: "como-entrenar-a-tu-dragon",
    titulo: "Cómo Entrenar a tu Dragón",
    genero: "Fantasía",
    clasificacion: "ATP",
    poster: null,
    banner: dragonBanner,
    descripcion: "La épica aventura llega en acción real.",
    funciones: [
      { id: "f1", hora: "14:30", sala: 1, precio: 15 },
      { id: "f2", hora: "16:45", sala: 1, precio: 15 },
    ],
  },
];

export const buscarPelicula = (id) => peliculas.find((p) => p.id === id);
