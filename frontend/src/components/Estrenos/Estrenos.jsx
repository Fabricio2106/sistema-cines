import { useMemo, useState } from "react";
import PeliculaCard from "../PeliculaCard/PeliculaCard";
import { useCartelera } from "../../context/CarteleraContext";
import { esEstreno } from "../../utils/estreno";

const TODAS = "Todas";

const Estrenos = () => {
  const { peliculas, cargando, error } = useCartelera();
  const [genero, setGenero] = useState(TODAS);

  const generos = useMemo(() => [TODAS, ...new Set(peliculas.map((p) => p.genero))], [peliculas]);
  // Los estrenos van primero; el resto conserva el orden de la cartelera
  const visibles = (genero === TODAS ? peliculas : peliculas.filter((p) => p.genero === genero))
    .slice()
    .sort((a, b) => Number(esEstreno(b.fechaEstreno)) - Number(esEstreno(a.fechaEstreno)));

  return (
    <section id="estrenos" aria-label="Cartelera" className="scroll-mt-20 px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-7xl">
        {peliculas.length > 0 && (
          <div
            className="mb-8 flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Filtrar por género"
          >
            {generos.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenero(g)}
                aria-pressed={genero === g}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  genero === g
                    ? "border-accent-500 bg-accent-500 text-black"
                    : "border-primary-600/70 text-white hover:border-accent-500 hover:text-accent-400"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {cargando && <p className="mt-12 text-center text-surface-400">Cargando cartelera…</p>}
        {error && (
          <p role="alert" className="mt-12 text-center text-red-300">
            No pudimos cargar la cartelera. Recarga la página en unos segundos.
          </p>
        )}
        {!cargando && !error && peliculas.length === 0 && (
          <p className="mt-12 text-center text-surface-400">No hay películas en cartelera por ahora.</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {visibles.map((pelicula) => (
            <PeliculaCard key={pelicula.id} pelicula={pelicula} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Estrenos;
