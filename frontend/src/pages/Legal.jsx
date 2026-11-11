import { Link, useParams } from "react-router-dom";
import { LEGAL } from "../data/legal";
import { CINE } from "../data/cine";

const Legal = () => {
  const { tema } = useParams();
  const pagina = LEGAL[tema];

  if (!pagina) {
    return (
      <main className="mx-auto max-w-3xl px-6 pb-16 pt-32 text-center text-white">
        <h1 className="mb-4 text-2xl font-bold">No encontramos esa página</h1>
        <Link to="/" className="text-accent-400 hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-28 text-surface-300">
      <h1 className="mb-2 border-b-2 border-accent-400 pb-3 text-3xl font-bold text-white sm:text-4xl">
        {pagina.titulo}
      </h1>
      <p className="mt-3 text-sm text-surface-400">
        {CINE.razonSocial} · RUC {CINE.ruc}
      </p>
      <p className="mb-10 text-sm text-surface-500">Última actualización: noviembre de 2026</p>

      <div className="space-y-8">
        {pagina.secciones.map((s) => (
          <section key={s.t}>
            <h2 className="mb-3 text-xl font-bold text-white">{s.t}</h2>
            <div className="space-y-3 leading-relaxed">
              {s.lista && (
                <ol className="list-decimal space-y-3 pl-6 marker:font-bold marker:text-accent-400">
                  {s.lista.map((texto) => (
                    <li key={texto}>{texto}</li>
                  ))}
                </ol>
              )}
              {s.p?.map((texto) => (
                <p key={texto}>{texto}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Link to="/" className="mt-12 inline-block text-accent-400 hover:underline">
        ← Volver al inicio
      </Link>
    </main>
  );
};

export default Legal;
