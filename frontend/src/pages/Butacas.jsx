import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCartelera } from "../context/CarteleraContext";
import { asientosOcupados } from "../services/compras";
import PaginaCargando from "../components/PaginaCargando/PaginaCargando";
import { esFechaValida, funcionYaEmpezo, hoyLima, textoFecha } from "../utils/fechas";

const MAX_BUTACAS = 8;

const estilos = {
  libre: "border-b-primary-950 bg-primary-700 text-primary-100 hover:-translate-y-0.5 hover:bg-primary-500",
  seleccionada: "-translate-y-0.5 border-b-accent-600 bg-accent-400 text-black shadow-lg shadow-accent-500/40",
  ocupada: "cursor-not-allowed border-b-transparent bg-surface-800/70 text-surface-600",
};

const Dato = ({ icono, children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-primary-700/50 bg-primary-900/50 px-3 py-1.5 text-xs font-semibold text-primary-100/80 sm:text-sm">
    <i className={`bi ${icono} text-accent-400`} aria-hidden="true" />
    {children}
  </span>
);

const Butacas = () => {
  const { id, funcionId } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fecha = esFechaValida(params.get("fecha")) ? params.get("fecha") : hoyLima();
  const { buscarPelicula, salas, cargando } = useCartelera();
  const pelicula = buscarPelicula(id);
  const funcion = pelicula?.funciones.find((f) => f.id === funcionId);
  const sala = funcion && salas[funcion.sala];
  const [seleccion, setSeleccion] = useState([]);
  const [ocupadas, setOcupadas] = useState([]);

  useEffect(() => {
    let activo = true;
    asientosOcupados(id, funcionId, fecha).then((lista) => {
      if (!activo) return;
      setOcupadas(lista);
      // Si alguien compró una butaca que tenías elegida, se quita de tu selección
      setSeleccion((prev) => prev.filter((a) => !lista.includes(a)));
    });
    return () => {
      activo = false;
    };
  }, [id, funcionId, fecha]);

  if (cargando) {
    return <PaginaCargando />;
  }

  if (!pelicula || !funcion || !sala || funcionYaEmpezo(fecha, funcion.hora)) {
    return (
      <main className="min-h-screen pt-32 px-6 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Función no disponible</h1>
        <Link to="/#estrenos" className="text-accent-400 hover:underline">
          Volver a los estrenos
        </Link>
      </main>
    );
  }

  const total = seleccion.length * funcion.precio;
  const mitad = Math.ceil(sala.asientosPorFila / 2);
  const libres = sala.filas.length * sala.asientosPorFila - ocupadas.length;

  const alternar = (asiento) => {
    if (ocupadas.includes(asiento)) return;
    if (!seleccion.includes(asiento) && seleccion.length >= MAX_BUTACAS) {
      toast.error(`Puedes elegir hasta ${MAX_BUTACAS} butacas por compra`);
      return;
    }
    setSeleccion((prev) => (prev.includes(asiento) ? prev.filter((a) => a !== asiento) : [...prev, asiento]));
  };

  const butaca = (fila, numero) => {
    const asiento = `${fila}${numero}`;
    const ocupada = ocupadas.includes(asiento);
    const elegida = seleccion.includes(asiento);
    return (
      <button
        key={asiento}
        type="button"
        disabled={ocupada}
        aria-pressed={elegida}
        aria-label={`Butaca ${asiento}${ocupada ? ", ocupada" : elegida ? ", seleccionada" : ""}`}
        onClick={() => alternar(asiento)}
        className={`flex aspect-square min-w-[22px] max-w-9 flex-1 items-center justify-center rounded-t-xl rounded-b-md border-b-4 text-[9px] font-bold transition-all duration-150 sm:text-xs ${
          ocupada ? estilos.ocupada : elegida ? estilos.seleccionada : estilos.libre
        }`}
      >
        {ocupada ? <i className="bi bi-x-lg text-[9px]" aria-hidden="true" /> : numero}
      </button>
    );
  };

  return (
    <main className="min-h-screen px-4 pb-44 pt-24 text-white sm:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/pelicula/${pelicula.id}?fecha=${fecha}#funciones`}
          className="inline-flex items-center gap-2 text-sm text-accent-400 hover:underline"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Volver a {pelicula.titulo}
        </Link>

        <h1 className="mt-3 text-2xl font-bold sm:text-4xl">{pelicula.titulo}</h1>
        <div className="mb-8 mt-4 flex flex-wrap gap-2">
          <Dato icono="bi-calendar-event-fill">
            <span className="inline-block first-letter:uppercase">{textoFecha(fecha)}</span>
          </Dato>
          <Dato icono="bi-clock-fill">{funcion.hora}</Dato>
          <Dato icono="bi-door-open-fill">{sala.nombre}</Dato>
          <Dato icono="bi-ticket-perforated-fill">S/ {funcion.precio} por entrada</Dato>
        </div>

        {/* Pantalla curva */}
        <div className="mb-10" aria-hidden="true">
          <div
            className="mx-auto h-14 w-[92%] rounded-t-[50%] border-t-[6px] border-primary-400 bg-gradient-to-b from-primary-400/25 to-transparent"
            style={{ boxShadow: "0 -18px 40px -8px rgba(229, 50, 45, 0.55)" }}
          />
          <p className="mt-3 text-center text-xs font-bold tracking-[0.4em] text-primary-100/50">PANTALLA</p>
        </div>

        {/* Mapa de butacas: las butacas se reparten el ancho disponible */}
        <div className="mx-auto mb-6 flex w-full max-w-xl flex-col gap-1.5 overflow-x-auto pb-2 sm:gap-2">
          {sala.filas.map((fila) => (
            <div key={fila} className="flex items-center gap-0.5 sm:gap-1.5">
              <span className="w-4 shrink-0 text-center text-[10px] font-bold text-primary-100/50 sm:w-5 sm:text-xs">{fila}</span>
              <div className="flex flex-1 justify-center gap-0.5 sm:gap-1.5">
                {Array.from({ length: mitad }, (_, i) => butaca(fila, i + 1))}
              </div>
              <span className="w-3 shrink-0 sm:w-8" aria-hidden="true" />
              <div className="flex flex-1 justify-center gap-0.5 sm:gap-1.5">
                {Array.from({ length: sala.asientosPorFila - mitad }, (_, i) => butaca(fila, mitad + i + 1))}
              </div>
              <span className="w-4 shrink-0 text-center text-[10px] font-bold text-primary-100/50 sm:w-5 sm:text-xs">{fila}</span>
            </div>
          ))}
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-100/70">
          <li className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-t-lg rounded-b border-b-4 border-b-primary-950 bg-primary-700" /> Disponible
          </li>
          <li className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-t-lg rounded-b border-b-4 border-b-accent-600 bg-accent-400" /> Seleccionada
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-t-lg rounded-b bg-surface-800/70 text-[8px] text-surface-600">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </span>
            Ocupada
          </li>
        </ul>
        <p className="mt-4 text-center text-xs text-primary-100/50">
          {libres} butacas libres · máximo {MAX_BUTACAS} por compra
        </p>
      </div>

      {/* Barra de compra */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary-700/50 bg-primary-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {seleccion.length === 0 ? (
              <p className="text-sm text-primary-100/70">Elige tus butacas en el mapa</p>
            ) : (
              <ul className="flex flex-wrap items-center gap-1.5" aria-label="Butacas elegidas">
                {seleccion.map((a) => (
                  <li key={a}>
                    <button
                      type="button"
                      onClick={() => alternar(a)}
                      aria-label={`Quitar butaca ${a}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent-400 px-2.5 py-1 text-xs font-bold text-black hover:bg-accent-300"
                    >
                      {a}
                      <i className="bi bi-x" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-1.5 text-lg font-bold text-accent-400">
              Total: S/ {total}
              {seleccion.length > 0 && (
                <span className="ml-2 text-xs font-medium text-primary-100/60">
                  {seleccion.length} {seleccion.length === 1 ? "entrada" : "entradas"}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            disabled={seleccion.length === 0}
            onClick={() =>
              navigate("/resumen", {
                state: { peliculaId: pelicula.id, funcionId: funcion.id, asientos: seleccion, fecha },
              })
            }
            className="rounded-full bg-accent-400 px-8 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  );
};

export default Butacas;
