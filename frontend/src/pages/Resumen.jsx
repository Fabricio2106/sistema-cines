import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useCartelera } from "../context/CarteleraContext";
import { crearCompra } from "../services/compras";

const Resumen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { buscarPelicula, salas, cargando } = useCartelera();
  const pelicula = buscarPelicula(state?.peliculaId);
  const funcion = pelicula?.funciones.find((f) => f.id === state?.funcionId);
  const asientos = state?.asientos ?? [];

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center text-surface-400">Cargando…</main>
    );
  }

  if (!pelicula || !funcion || asientos.length === 0) {
    return <Navigate to="/#estrenos" replace />;
  }

  const total = asientos.length * funcion.precio;
  const volver = `/pelicula/${pelicula.id}/butacas/${funcion.id}`;

  const confirmar = async () => {
    setError("");
    setEnviando(true);
    try {
      const compra = await crearCompra({ pelicula, funcion, asientos });
      navigate(`/ticket/${compra.id}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  const filas = [
    ["Película", pelicula.titulo],
    ["Función", `${funcion.hora} · ${salas[funcion.sala]?.nombre}`],
    ["Butacas", asientos.join(", ")],
    ["Precio por entrada", `S/ ${funcion.precio}`],
    ["Cantidad", asientos.length],
  ];

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-12 text-white">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Resumen de tu compra</h1>

        <dl className="bg-surface-900 border border-primary-700/40 rounded-2xl divide-y divide-surface-800">
          {filas.map(([etiqueta, valor]) => (
            <div key={etiqueta} className="flex justify-between gap-4 px-5 py-3">
              <dt className="text-surface-400">{etiqueta}</dt>
              <dd className="font-semibold text-right">{valor}</dd>
            </div>
          ))}
          <div className="flex justify-between px-5 py-4 text-lg">
            <dt className="font-bold">Total</dt>
            <dd className="font-bold text-accent-400">S/ {total}</dd>
          </div>
        </dl>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-300 bg-red-950/60 border border-red-800 rounded-lg px-3 py-2">
            {error}{" "}
            <Link to={volver} className="underline">
              Elegir otras butacas
            </Link>
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to={volver}
            className="text-center px-6 py-3 rounded-full font-semibold border-2 border-primary-600 hover:bg-primary-600 transition-colors"
          >
            Cambiar butacas
          </Link>
          <button
            type="button"
            onClick={confirmar}
            disabled={enviando}
            className="flex-1 px-6 py-3 rounded-full font-bold bg-accent-500 hover:bg-accent-600 text-black disabled:opacity-50 transition-colors"
          >
            {enviando ? "Procesando…" : "Confirmar compra"}
          </button>
        </div>
        <p className="text-xs text-surface-500 mt-4 text-center">
          Todavía no se cobra ningún pago: la compra solo reserva tus butacas.
        </p>
      </div>
    </main>
  );
};

export default Resumen;
