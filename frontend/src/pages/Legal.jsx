import { Link, useParams } from "react-router-dom";
import { LEGAL } from "../data/legal";
import { CINE } from "../data/cine";
import EncabezadoPagina from "../components/EncabezadoPagina/EncabezadoPagina";

const ICONOS = {
  "politica-de-datos-personales": "bi-shield-lock-fill",
  "condiciones-de-uso-y-seguridad": "bi-person-lock",
  "terminos-y-condiciones": "bi-file-earmark-text-fill",
  "reglas-de-convivencia": "bi-people-fill",
};

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
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-32 text-primary-100/80">
      <EncabezadoPagina icono={ICONOS[tema] ?? "bi-file-earmark-text-fill"} titulo={pagina.titulo}>
        <p className="mt-4 text-sm text-primary-100/60">
          {CINE.razonSocial} · RUC {CINE.ruc}
        </p>
        <p className="text-xs text-primary-100/40">Última actualización: noviembre de 2026</p>
      </EncabezadoPagina>

      {/* Salto a las otras páginas legales */}
      <nav aria-label="Otras páginas legales" className="mb-10 flex flex-wrap justify-center gap-2">
        {Object.entries(LEGAL).map(([clave, p]) => (
          <Link
            key={clave}
            to={`/legal/${clave}`}
            aria-current={clave === tema ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              clave === tema
                ? "border-accent-400 bg-accent-400 text-black"
                : "border-primary-600/60 text-primary-100/80 hover:border-accent-400 hover:text-accent-400"
            }`}
          >
            {p.titulo}
          </Link>
        ))}
      </nav>

      <div className="space-y-5">
        {pagina.secciones.map((s, i) => (
          <section key={s.t} className="rounded-2xl border border-primary-700/40 bg-primary-900/30 p-6">
            <h2 className="mb-3 flex items-center gap-3 text-lg font-bold text-white sm:text-xl">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600/30 text-sm text-accent-400">
                {i + 1}
              </span>
              {s.t}
            </h2>
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

      <Link to="/" className="mt-12 inline-flex items-center gap-2 font-semibold text-accent-400 hover:underline">
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Volver al inicio
      </Link>
    </main>
  );
};

export default Legal;
