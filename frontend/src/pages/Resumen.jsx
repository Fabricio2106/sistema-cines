import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useCartelera } from "../context/CarteleraContext";
import { crearCompra } from "../services/compras";
import PaginaCargando from "../components/PaginaCargando/PaginaCargando";
import { esFechaValida, textoFecha } from "../utils/fechas";

const PASOS = ["Función", "Butacas", "Resumen"];

const Pasos = () => (
  <ol className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold sm:gap-3 sm:text-sm" aria-label="Pasos de la compra">
    {PASOS.map((paso, i) => {
      const actual = i === PASOS.length - 1;
      return (
        <li key={paso} className="flex items-center gap-2 sm:gap-3" aria-current={actual ? "step" : undefined}>
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              actual ? "bg-accent-400 text-black" : "bg-primary-600 text-white"
            }`}
          >
            {actual ? i + 1 : <i className="bi bi-check-lg" aria-hidden="true" />}
          </span>
          <span className={actual ? "text-white" : "text-primary-100/60"}>{paso}</span>
          {!actual && <span className="h-px w-6 bg-primary-600/60 sm:w-10" aria-hidden="true" />}
        </li>
      );
    })}
  </ol>
);

const Fila = ({ etiqueta, children }) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <dt className="text-sm text-primary-100/60">{etiqueta}</dt>
    <dd className="text-right font-semibold">{children}</dd>
  </div>
);

const Resumen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { buscarPelicula, salas, cargando } = useCartelera();
  const pelicula = buscarPelicula(state?.peliculaId);
  const funcion = pelicula?.funciones.find((f) => f.id === state?.funcionId);
  const asientos = state?.asientos ?? [];
  const fecha = state?.fecha;

  if (cargando) {
    return <PaginaCargando />;
  }

  if (!pelicula || !funcion || asientos.length === 0 || !esFechaValida(fecha)) {
    return <Navigate to="/#estrenos" replace />;
  }

  const total = asientos.length * funcion.precio;
  const volver = `/pelicula/${pelicula.id}/butacas/${funcion.id}?fecha=${fecha}`;

  const confirmar = async () => {
    setError("");
    setEnviando(true);
    try {
      const compra = await crearCompra({ pelicula, funcion, asientos, fecha });
      navigate(`/ticket/${compra.id}`, { replace: true });
      toast.success("¡Compra realizada! Aquí está tu ticket");
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen px-4 pb-16 pt-28 text-white sm:px-12">
      <div className="mx-auto max-w-xl">
        <Pasos />

        <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">Revisa tu compra</h1>

        <article className="overflow-hidden rounded-3xl border border-primary-700/50 bg-primary-900/40 shadow-xl shadow-black/40">
          {/* Película */}
          <header className="flex items-center gap-4 border-b border-primary-800/60 p-5">
            {(pelicula.poster ?? pelicula.banner) && (
              <img
                src={pelicula.poster ?? pelicula.banner}
                alt={`Póster de ${pelicula.titulo}`}
                className="h-24 w-16 shrink-0 rounded-lg object-cover shadow-lg shadow-black/50"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-400">{pelicula.genero}</p>
              <h2 className="text-lg font-bold leading-snug sm:text-xl">{pelicula.titulo}</h2>
              <p className="mt-1 text-sm text-primary-100/60">
                <span className="inline-block first-letter:uppercase">{textoFecha(fecha)}</span>
              </p>
            </div>
          </header>

          {/* Detalle */}
          <dl className="divide-y divide-primary-800/50 px-5">
            <Fila etiqueta="Hora y sala">
              {funcion.hora} · {salas[funcion.sala]?.nombre}
            </Fila>
            <Fila etiqueta="Butacas">
              <span className="flex flex-wrap justify-end gap-1.5">
                {asientos.map((a) => (
                  <span key={a} className="rounded-md bg-accent-400 px-2 py-0.5 text-sm font-bold text-black">
                    {a}
                  </span>
                ))}
              </span>
            </Fila>
            <Fila etiqueta="Precio por entrada">S/ {funcion.precio}</Fila>
            <Fila etiqueta="Cantidad">
              {asientos.length} {asientos.length === 1 ? "entrada" : "entradas"}
            </Fila>
          </dl>

          {/* Total */}
          <div className="mt-2 flex items-center justify-between border-t-2 border-dashed border-primary-600/60 bg-black/20 px-5 py-5">
            <span className="text-lg font-bold">Total</span>
            <span className="text-3xl font-bold text-accent-400">S/ {total}</span>
          </div>
        </article>

        <p className="mt-4 flex items-start gap-2 rounded-xl border border-primary-700/40 bg-primary-900/30 px-4 py-3 text-xs text-primary-100/60">
          <i className="bi bi-info-circle-fill mt-0.5 text-accent-400" aria-hidden="true" />
          Todavía no se cobra ningún pago: la compra solo reserva tus butacas.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">
            {error}{" "}
            <Link to={volver} className="font-semibold underline">
              Elegir otras butacas
            </Link>
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={volver}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-600 px-6 py-3 text-center font-semibold transition-colors hover:bg-primary-600"
          >
            <i className="bi bi-arrow-left" aria-hidden="true" />
            Cambiar butacas
          </Link>
          <button
            type="button"
            onClick={confirmar}
            disabled={enviando}
            className="flex-1 rounded-full bg-accent-400 px-6 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 disabled:translate-y-0 disabled:opacity-50"
          >
            {enviando ? "Procesando…" : "Confirmar compra"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Resumen;
