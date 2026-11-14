import { Link, useParams, useSearchParams } from "react-router-dom";
import Calendario from "../components/Calendario/Calendario";
import TrailerDialog from "../components/TrailerDialog/TrailerDialog";
import { esFechaValida, funcionYaEmpezo, hoyLima, textoFecha } from "../utils/fechas";
import { esEstreno } from "../utils/estreno";
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

  const { titulo, genero, clasificacion, poster, banner, descripcion, funciones, trailer, fechaEstreno } = pelicula;
  const fondo = banner ?? poster;
  const desde = funciones.length > 0 ? Math.min(...funciones.map((f) => f.precio)) : null;

  return (
    <main className="min-h-screen pb-20 text-white">
      {/* Cabecera con la imagen de la película de fondo */}
      <section className="relative overflow-hidden px-6 pb-12 pt-28 sm:px-12">
        {fondo && (
          <img
            src={fondo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-md"
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary-950/40 via-primary-950/70 to-[rgb(26,0,0)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[280px_1fr] md:gap-12">
          <img
            src={poster ?? banner}
            alt={`Póster de ${titulo}`}
            className="mx-auto aspect-[2/3] w-full max-w-[260px] rounded-2xl object-cover shadow-2xl shadow-black/70 ring-1 ring-white/10 md:max-w-none"
          />

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-bold">{genero}</span>
              {clasificacion && (
                <span className="rounded-full bg-accent-400 px-3 py-1 text-xs font-bold text-black">{clasificacion}</span>
              )}
              {esEstreno(fechaEstreno) && (
                <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">Estreno</span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{titulo}</h1>
            <p className="mt-5 max-w-2xl leading-relaxed text-primary-100/80">{descripcion}</p>

            {desde !== null && (
              <p className="mt-5 text-sm text-primary-100/60">
                Entradas desde <span className="text-xl font-bold text-accent-400">S/ {desde}</span>
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#funciones"
                className="inline-flex items-center gap-2 rounded-full bg-accent-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300"
              >
                <i className="bi bi-ticket-perforated-fill" aria-hidden="true" />
                Comprar entradas
              </a>
              {trailer && <TrailerDialog url={trailer} titulo={titulo} />}
            </div>
          </div>
        </div>
      </section>

      {/* Fecha y funciones */}
      <section id="funciones" className="scroll-mt-24 px-6 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="h-7 w-1.5 rounded bg-accent-400" aria-hidden="true" />
            Elige tu función
          </h2>

          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            <div className="w-fit rounded-2xl border border-primary-700/40 bg-primary-900/30 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-100/50">1 · Fecha</p>
              <Calendario valor={fecha} onCambio={(f) => setParams({ fecha: f }, { replace: true, preventScrollReset: true })} />
            </div>

            <div className="rounded-2xl border border-primary-700/40 bg-primary-900/30 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary-100/50">2 · Horario</p>
              <p className="mb-4 font-semibold first-letter:uppercase">{textoFecha(fecha)}</p>

              {funciones.length === 0 ? (
                <p className="text-sm text-primary-100/60">Todavía no hay funciones programadas para esta película.</p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {funciones.map((f) => {
                    const empezo = funcionYaEmpezo(fecha, f.hora);
                    const cuerpo = (
                      <>
                        <span className="text-2xl font-bold">{f.hora}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-primary-100/60">
                          <i className="bi bi-door-open-fill" aria-hidden="true" />
                          {salas[f.sala]?.nombre}
                        </span>
                        <span className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                          {empezo ? (
                            <span className="font-semibold text-primary-100/50">Ya comenzó</span>
                          ) : (
                            <>
                              <span className="font-bold text-accent-400">S/ {f.precio}</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-primary-100/70 transition-colors group-hover:text-white">
                                Elegir butacas
                                <i className="bi bi-arrow-right" aria-hidden="true" />
                              </span>
                            </>
                          )}
                        </span>
                      </>
                    );
                    return (
                      <li key={f.id}>
                        {empezo ? (
                          <div aria-disabled="true" className="flex flex-col rounded-xl border border-primary-800/50 bg-primary-950/50 p-4 opacity-50">
                            {cuerpo}
                          </div>
                        ) : (
                          <Link
                            to={`/pelicula/${pelicula.id}/butacas/${f.id}?fecha=${fecha}`}
                            className="group flex flex-col rounded-xl border border-primary-700/50 bg-primary-950/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/60 hover:shadow-lg hover:shadow-primary-500/20"
                          >
                            {cuerpo}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Pelicula;
