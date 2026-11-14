import { Link, useParams, useSearchParams } from "react-router-dom";
import Calendario from "../components/Calendario/Calendario";
import TrailerDialog from "../components/TrailerDialog/TrailerDialog";
import { esFechaValida, funcionYaEmpezo, hoyLima, textoFecha } from "../utils/fechas";
import { useCartelera } from "../context/CarteleraContext";
import PaginaCargando from "../components/PaginaCargando/PaginaCargando";

const Pelicula = () => {
  const { id } = useParams();
  const { buscarPelicula, salas, cargando } = useCartelera();
  const pelicula = buscarPelicula(id);
  const [params, setParams] = useSearchParams();
  const fecha = esFechaValida(params.get("fecha")) ? params.get("fecha") : hoyLima();

  if (cargando) {
    return <PaginaCargando />;
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

  const { titulo, genero, clasificacion, poster, banner, descripcion, funciones, trailer } = pelicula;

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
          <p className="text-surface-300 mb-6">{descripcion}</p>
          {trailer && (
            <div className="mb-8">
              <TrailerDialog url={trailer} titulo={titulo} />
            </div>
          )}

          <section id="funciones" className="scroll-mt-24">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-accent-400 pb-2 inline-block">Elige la fecha</h2>
            <div className="mb-8 w-fit rounded-2xl border border-primary-700/40 bg-primary-900/30 p-3">
              <Calendario valor={fecha} onCambio={(f) => setParams({ fecha: f }, { replace: true, preventScrollReset: true })} />
            </div>

            <h2 className="text-xl font-bold mb-4 border-b-2 border-accent-400 pb-2 inline-block first-letter:uppercase">
              Funciones del {textoFecha(fecha)}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {funciones.map((f) => {
                const empezo = funcionYaEmpezo(fecha, f.hora);
                const contenido = (
                  <>
                    <span>
                      <span className="block text-lg font-bold">{f.hora}</span>
                      <span className="text-xs text-surface-400">{salas[f.sala]?.nombre}</span>
                    </span>
                    {empezo ? (
                      <span className="text-xs font-semibold text-surface-500">Ya comenzó</span>
                    ) : (
                      <span className="text-accent-400 font-bold">S/ {f.precio}</span>
                    )}
                  </>
                );
                return (
                  <li key={f.id}>
                    {empezo ? (
                      <div
                        aria-disabled="true"
                        className="flex items-center justify-between rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3 opacity-50"
                      >
                        {contenido}
                      </div>
                    ) : (
                      <Link
                        to={`/pelicula/${pelicula.id}/butacas/${f.id}?fecha=${fecha}`}
                        className="flex items-center justify-between bg-surface-900 hover:bg-primary-900/60 border border-primary-700/40 rounded-lg px-4 py-3 transition-colors"
                      >
                        {contenido}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Pelicula;
