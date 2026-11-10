import { Link } from "react-router-dom";

const PeliculaCard = ({ pelicula }) => {
  const { id, titulo, genero, clasificacion, poster, banner, funciones } = pelicula;

  return (
    <article className="bg-surface-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 transition-shadow duration-300 flex flex-col">
      <Link to={`/pelicula/${id}`} className="relative block overflow-hidden group">
        <img
          src={poster ?? banner}
          alt={`Póster de ${titulo}`}
          loading="lazy"
          className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-bold">
            {genero}
          </span>
          <span className="bg-accent-500 text-black text-xs px-3 py-1 rounded-full font-bold">
            {clasificacion}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2">{titulo}</h3>
        <p className="text-surface-400 text-xs">
          {funciones.map((f) => f.hora).join(" · ")}
        </p>
        <div className="mt-auto flex gap-2">
          <Link
            to={`/pelicula/${id}`}
            className="flex-1 text-center px-3 py-2 text-sm font-semibold text-white rounded-lg border-2 border-primary-600 hover:bg-primary-600 transition-colors"
          >
            Detalles
          </Link>
          <Link
            to={`/pelicula/${id}#funciones`}
            className="flex-1 text-center px-3 py-2 text-sm font-bold text-black rounded-lg bg-accent-500 hover:bg-accent-600 transition-colors"
          >
            Comprar
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PeliculaCard;
