import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCartelera } from "../context/CarteleraContext";
import { asientosOcupados } from "../services/compras";

const estilos = {
  libre: "bg-surface-700 hover:bg-primary-500 text-white",
  seleccionada: "bg-accent-500 text-black ring-2 ring-accent-300",
  ocupada: "bg-surface-900 text-surface-600 cursor-not-allowed line-through",
};

const Butacas = () => {
  const { id, funcionId } = useParams();
  const navigate = useNavigate();
  const { buscarPelicula, salas, cargando } = useCartelera();
  const pelicula = buscarPelicula(id);
  const funcion = pelicula?.funciones.find((f) => f.id === funcionId);
  const sala = funcion && salas[funcion.sala];
  const [seleccion, setSeleccion] = useState([]);
  const [ocupadas, setOcupadas] = useState([]);

  useEffect(() => {
    let activo = true;
    asientosOcupados(id, funcionId).then((lista) => {
      if (!activo) return;
      setOcupadas(lista);
      // Si alguien compró una butaca que tenías elegida, se quita de tu selección
      setSeleccion((prev) => prev.filter((a) => !lista.includes(a)));
    });
    return () => {
      activo = false;
    };
  }, [id, funcionId]);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center text-surface-400">Cargando…</main>
    );
  }

  if (!pelicula || !funcion || !sala) {
    return (
      <main className="min-h-screen pt-32 px-6 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Función no encontrada</h1>
        <Link to="/#estrenos" className="text-accent-400 hover:underline">
          Volver a los estrenos
        </Link>
      </main>
    );
  }

  const total = seleccion.length * funcion.precio;

  const alternar = (asiento) => {
    if (ocupadas.includes(asiento)) return;
    setSeleccion((prev) =>
      prev.includes(asiento) ? prev.filter((a) => a !== asiento) : [...prev, asiento]
    );
  };

  return (
    <main className="min-h-screen pt-24 pb-32 px-4 sm:px-12 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to={`/pelicula/${pelicula.id}#funciones`} className="text-sm text-accent-400 hover:underline">
          ← Volver a {pelicula.titulo}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2">{pelicula.titulo}</h1>
        <p className="text-surface-400 mb-8">
          {sala.nombre} · {funcion.hora} · S/ {funcion.precio} por entrada
        </p>

        <div className="mb-8">
          <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
          <p className="text-center text-xs tracking-widest text-surface-400 mt-2">PANTALLA</p>
        </div>

        <div className="flex flex-col items-center gap-2 overflow-x-auto pb-2">
          {sala.filas.map((fila) => (
            <div key={fila} className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-5 text-xs text-surface-400">{fila}</span>
              {Array.from({ length: sala.asientosPorFila }, (_, i) => {
                const asiento = `${fila}${i + 1}`;
                const ocupada = ocupadas.includes(asiento);
                const elegida = seleccion.includes(asiento);
                return (
                  <button
                    key={asiento}
                    type="button"
                    disabled={ocupada}
                    aria-pressed={elegida}
                    aria-label={`Butaca ${asiento}${ocupada ? ", ocupada" : ""}`}
                    onClick={() => alternar(asiento)}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-t-lg text-[10px] sm:text-xs font-semibold transition-colors ${
                      ocupada ? estilos.ocupada : elegida ? estilos.seleccionada : estilos.libre
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <ul className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-surface-300">
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-t bg-surface-700" /> Disponible
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-t bg-accent-500" /> Seleccionada
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-t bg-surface-900 border border-surface-700" /> Ocupada
          </li>
        </ul>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-primary-950/95 backdrop-blur border-t border-primary-700/40 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-surface-300">
              {seleccion.length === 0 ? "Elige tus butacas" : seleccion.join(", ")}
            </p>
            <p className="text-lg font-bold text-accent-400">Total: S/ {total}</p>
          </div>
          <button
            type="button"
            disabled={seleccion.length === 0}
            onClick={() =>
              navigate("/resumen", {
                state: { peliculaId: pelicula.id, funcionId: funcion.id, asientos: seleccion },
              })
            }
            className="px-6 py-3 rounded-full font-bold bg-accent-500 hover:bg-accent-600 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  );
};

export default Butacas;
