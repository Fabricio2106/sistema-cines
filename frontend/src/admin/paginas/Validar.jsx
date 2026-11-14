import { useState } from "react";
import { COMPRAS } from "../datos";
import { Tarjeta, TituloPagina, entrada } from "../ui";

const ESTADOS = {
  valida: { icono: "bi-check-circle-fill", color: "text-green-400", borde: "border-green-500/40 bg-green-500/10", titulo: "Entrada válida" },
  usada: { icono: "bi-exclamation-triangle-fill", color: "text-accent-400", borde: "border-accent-400/40 bg-accent-400/10", titulo: "Esta entrada ya fue usada" },
  noExiste: { icono: "bi-x-circle-fill", color: "text-red-400", borde: "border-red-500/40 bg-red-500/10", titulo: "No encontramos esa entrada" },
};

// MAQUETA: valida contra una lista de ejemplo. Pruebas: A1B2C3D4 (válida), F7G8H9J2 (usada), cualquier otro (no existe).
const Validar = () => {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [usadas, setUsadas] = useState([]);

  const validar = (e) => {
    e.preventDefault();
    const limpio = codigo.trim().toUpperCase();
    const compra = COMPRAS.find((c) => c.codigo === limpio);
    if (!compra) return setResultado({ estado: "noExiste", codigo: limpio });
    const yaUsada = compra.usada || usadas.includes(compra.codigo);
    setResultado({ estado: yaUsada ? "usada" : "valida", compra });
  };

  const marcarUsada = () => {
    setUsadas((prev) => [...prev, resultado.compra.codigo]);
    setResultado({ estado: "usada", compra: resultado.compra, recienMarcada: true });
  };

  const info = resultado && ESTADOS[resultado.estado];

  return (
    <>
      <TituloPagina titulo="Validar entradas" descripcion="Escribe o escanea el código de la entrada del cliente para dejarlo pasar a la sala." />

      <div className="mx-auto max-w-xl">
        <Tarjeta className="p-6">
          <form onSubmit={validar} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-primary-100/70">Código de la entrada</span>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                maxLength={8}
                placeholder="A1B2C3D4"
                autoFocus
                className={`${entrada} text-center font-mono text-2xl font-bold tracking-[0.3em]`}
              />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={codigo.trim().length === 0}
                className="rounded-full bg-accent-400 py-3 font-bold text-black transition-colors hover:bg-accent-300 disabled:opacity-40"
              >
                Validar
              </button>
              <button
                type="button"
                disabled
                title="Disponible al conectar el panel"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-600/60 py-3 font-bold opacity-50"
              >
                <i className="bi bi-qr-code-scan" aria-hidden="true" />
                Escanear con cámara
              </button>
            </div>
          </form>
        </Tarjeta>

        {resultado && (
          <section role="status" className={`mt-6 rounded-2xl border p-6 ${info.borde}`}>
            <div className="flex items-center gap-4">
              <i className={`bi ${info.icono} text-4xl ${info.color}`} aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold">{resultado.recienMarcada ? "Entrada marcada como usada" : info.titulo}</h2>
                {resultado.estado === "noExiste" && (
                  <p className="text-sm text-primary-100/70">
                    El código <strong>{resultado.codigo}</strong> no existe. Revisa que esté bien escrito.
                  </p>
                )}
              </div>
            </div>

            {resultado.compra && (
              <dl className="mt-5 divide-y divide-white/10 text-sm">
                {[
                  ["Película", resultado.compra.pelicula],
                  ["Función", resultado.compra.funcion],
                  ["Butacas", resultado.compra.asientos],
                  ["Cliente", resultado.compra.cliente],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2">
                    <dt className="text-primary-100/60">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {resultado.estado === "valida" && (
              <button
                type="button"
                onClick={marcarUsada}
                className="mt-5 w-full rounded-full bg-green-500 py-3 font-bold text-black transition-colors hover:bg-green-400"
              >
                Marcar como usada y dejar pasar
              </button>
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default Validar;
