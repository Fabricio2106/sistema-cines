import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buscarCompra } from "../services/compras";

const Ticket = () => {
  const { id } = useParams();
  const [compra, setCompra] = useState(undefined); // undefined = cargando, null = no existe

  useEffect(() => {
    let activo = true;
    buscarCompra(id).then((c) => activo && setCompra(c));
    return () => {
      activo = false;
    };
  }, [id]);

  if (compra === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center text-surface-400">Cargando…</main>
    );
  }

  // La base solo devuelve compras del usuario con sesión, así que ajena = no existe
  if (compra === null) {
    return (
      <main className="min-h-screen pt-32 px-6 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Entrada no encontrada</h1>
        <Link to="/mis-entradas" className="text-accent-400 hover:underline">
          Ir a mis entradas
        </Link>
      </main>
    );
  }

  const datos = [
    ["Fecha", new Date(`${compra.fecha}T00:00`).toLocaleDateString("es-PE", { dateStyle: "long" })],
    ["Hora", compra.hora],
    ["Sala", compra.sala],
    ["Butacas", compra.asientos.join(", ")],
    ["Total", `S/ ${compra.total}`],
  ];

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 text-white">
      <div className="max-w-md mx-auto text-center">
        <p className="text-accent-400 font-bold mb-2">
          <i className="bi bi-check-circle-fill" /> ¡Compra confirmada!
        </p>

        <section className="bg-surface-900 border border-primary-700/40 rounded-2xl overflow-hidden text-left">
          <div className="bg-primary-700 px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-primary-200">Multicines Iquitos</p>
            <h1 className="text-xl font-bold">{compra.titulo}</h1>
          </div>
          <dl className="divide-y divide-surface-800">
            {datos.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-surface-400">{etiqueta}</dt>
                <dd className="font-semibold text-right">{valor}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t-2 border-dashed border-surface-700 px-5 py-5 text-center">
            <p className="text-xs text-surface-400">Código de entrada</p>
            <p className="text-3xl font-bold tracking-[0.3em] text-accent-400">{compra.codigo}</p>
            <p className="text-xs text-surface-500 mt-2">Preséntalo en boletería</p>
          </div>
        </section>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-3 rounded-full font-semibold border-2 border-primary-600 hover:bg-primary-600 transition-colors"
          >
            Imprimir
          </button>
          <Link
            to="/mis-entradas"
            className="px-6 py-3 rounded-full font-bold bg-accent-500 hover:bg-accent-600 text-black transition-colors"
          >
            Mis entradas
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Ticket;
