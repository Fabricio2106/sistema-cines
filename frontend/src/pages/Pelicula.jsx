import { Link, useParams } from "react-router-dom";
import { useCartelera } from "../context/CarteleraContext";

const Pelicula = () => {
  const { id } = useParams();
  const { buscarPelicula, salas, cargando } = useCartelera();
  const pelicula = buscarPelicula(id);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center text-surface-400">Cargando…</main>
    );
  }

  if (!pelicula) {
    return (
      <main className="min-h-screen pt-32 px-6 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Película no encontrada</h1>
        <Link to="/#estrenos" className="text-accent-400 hover:underline">
          Volver a los estrenos
        </Link>
      </main>
    );
  }

  const { titulo, genero, clasificacion, poster, banner, descripcion, funciones } = pelicula;

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 sm:px-12 text-white">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[280px_1fr]">
        <img
          src={poster ?? banner}
          alt={`Póster de ${titulo}`}
          className="w-full max-w-xs mx-auto md:max-w-none aspect-[2/3] object-cover rounded-xl shadow-xl"
        />

        <div>
          <div className="flex gap-2 mb-3">
            <span className="bg-primary-600 text-xs px-3 py-1 rounded-full font-bold">{genero}</span>
            {clasificacion && (
              <span className="bg-accent-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                {clasificacion}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{titulo}</h1>
          <p className="text-surface-300 mb-8">{descripcion}</p>

          <section id="funciones" className="scroll-mt-24">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-accent-400 pb-2 inline-block">
              Funciones de hoy
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {funciones.map((f) => (
                <li key={f.id}>
                  <Link
                    to={`/pelicula/${pelicula.id}/butacas/${f.id}`}
                    className="flex items-center justify-between bg-surface-900 hover:bg-primary-900/60 border border-primary-700/40 rounded-lg px-4 py-3 transition-colors"
                  >
                    <span>
                      <span className="block text-lg font-bold">{f.hora}</span>
                      <span className="text-xs text-surface-400">{salas[f.sala]?.nombre}</span>
                    </span>
                    <span className="text-accent-400 font-bold">S/ {f.precio}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Pelicula;
