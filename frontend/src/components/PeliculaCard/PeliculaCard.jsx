import { Link } from "react-router-dom";

import { esEstreno } from "../../utils/estreno";

// Toda la tarjeta es un enlace a la película: ahí el cliente ve horarios y compra.
const PeliculaCard = ({ pelicula }) => {
  const { id, titulo, genero, clasificacion, descripcion, poster, banner, funciones, fechaEstreno } = pelicula;
  const desde = funciones.length > 0 ? Math.min(...funciones.map((f) => f.precio)) : null;

  return (
    <Link
      to={`/pelicula/${id}`}
      aria-label={`Ver ${titulo}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-900/80 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent-500/50 hover:shadow-2xl hover:shadow-primary-500/20 focus-visible:border-accent-500 focus-visible:outline-none"
    >
      <div className="relative overflow-hidden">
        <img
          src={poster ?? banner}
          alt={`Póster de ${titulo}`}
          loading="lazy"
          className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Cinta diagonal en la esquina superior izquierda */}
        {esEstreno(fechaEstreno) && (
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-28 w-28 overflow-hidden" aria-hidden="true">
            <span className="absolute left-[-40px] top-[22px] w-[150px] -rotate-45 bg-rose-600 py-1 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Estreno
            </span>
          </div>
        )}
        {esEstreno(fechaEstreno) && <span className="sr-only">Estreno. </span>}

        {clasificacion && (
          <span className="absolute right-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-bold text-black shadow">
            {clasificacion}
          </span>
        )}

        {/* Sinopsis al pasar el mouse o enfocar con el teclado */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="line-clamp-5 text-sm leading-relaxed text-surface-100">{descripcion}</p>
          <span className="mt-3 text-sm font-semibold text-accent-400">Ver horarios y comprar →</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-base font-bold leading-snug text-white line-clamp-2">{titulo}</h3>
        <p className="text-sm text-surface-400">
          {genero}
          {desde !== null && (
            <>
              <span aria-hidden="true"> · </span>
              <span className="whitespace-nowrap">
                Desde <span className="font-semibold text-accent-400">S/ {desde}</span>
              </span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
};

export default PeliculaCard;
