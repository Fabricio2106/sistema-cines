import { Link } from "react-router-dom";

const PeliculaCard = ({ pelicula }) => {
  const { id, titulo, genero, clasificacion, poster, banner, funciones } = pelicula;

  return (
    <article className="group bg-surface-900 rounded-xl overflow-hidden border border-primary-900/50 shadow-xl hover:-translate-y-1 hover:border-primary-600/60 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 flex flex-col">
      <Link
        to={`/pelicula/${id}`}
        className="relative block overflow-hidden"
        aria-label={`Ver detalles de ${titulo}`}
      >
        <img
          src={poster ?? banner}
          alt={`Póster de ${titulo}`}
          loading="lazy"
          className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-900 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow">
            {genero}
          </span>
          <span className="bg-accent-500 text-black text-xs px-3 py-1 rounded-full font-bold shadow">
            {clasificacion}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
          {titulo}
        </h3>

        <ul className="flex flex-wrap gap-1.5" aria-label="Horarios">
          {funciones.map((f) => (
            <li
              key={f.id}
              className="text-xs text-surface-200 bg-surface-800 border border-surface-700 rounded-md px-2 py-0.5"
            >
              {f.hora}
            </li>
          ))}
        </ul>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/pelicula/${id}`}
            className="text-center px-3 py-2 text-sm font-semibold text-white rounded-lg border-2 border-primary-600 hover:bg-primary-600 transition-colors"
          >
            Detalles
          </Link>
          <Link
            to={`/pelicula/${id}#funciones`}
            className="text-center px-3 py-2 text-sm font-bold text-black rounded-lg bg-accent-500 hover:bg-accent-600 transition-colors"
          >
            Comprar
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PeliculaCard;
