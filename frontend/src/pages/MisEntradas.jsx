import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { comprasDeUsuario } from "../services/compras";

const MisEntradas = () => {
  const [compras, setCompras] = useState(null); // null = cargando
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    comprasDeUsuario()
      .then((lista) => activo && setCompras(lista))
      .catch((err) => {
        if (!activo) return;
        setError(err.message);
        setCompras([]);
      });
    return () => {
      activo = false;
    };
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-12 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Mis entradas</h1>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-300 bg-red-950/60 border border-red-800 rounded-lg px-3 py-2">
            No pudimos cargar tus entradas: {error}
          </p>
        )}

        {compras === null ? (
          <p className="text-surface-400">Cargando…</p>
        ) : compras.length === 0 ? (
          <div className="text-center bg-surface-900 border border-primary-700/40 rounded-2xl px-6 py-12">
            <p className="text-surface-300 mb-4">Todavía no tienes entradas.</p>
            <Link to="/#estrenos" className="text-accent-400 font-bold hover:underline">
              Ver estrenos
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {compras.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/ticket/${c.id}`}
                  className="flex items-center justify-between gap-4 bg-surface-900 hover:bg-primary-900/60 border border-primary-700/40 rounded-xl px-5 py-4 transition-colors"
                >
                  <span>
                    <span className="block font-bold">{c.titulo}</span>
                    <span className="text-sm text-surface-400">
                      {c.fecha} · {c.hora} · {c.sala} · {c.asientos.join(", ")}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-accent-400 font-bold">S/ {c.total}</span>
                    <span className="text-xs text-surface-500">{c.codigo}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default MisEntradas;
