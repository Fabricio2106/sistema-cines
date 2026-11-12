import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { comprasDeUsuario } from "../services/compras";

const campo =
  "w-full px-4 py-3 rounded-lg bg-surface-800 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-400 disabled:opacity-60";

const PASO = 5;

const TABS = [
  { id: "compras", titulo: "Mis compras", icono: "bi-ticket-perforated-fill" },
  { id: "datos", titulo: "Mis datos", icono: "bi-person-vcard-fill" },
];

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

const iniciales = (nombre) =>
  nombre
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const Resumen = ({ icono, valor, etiqueta }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-primary-700/40 bg-primary-900/40 px-5 py-4">
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600/25 text-xl text-accent-400">
      <i className={`bi ${icono}`} aria-hidden="true" />
    </span>
    <div>
      <p className="text-2xl font-bold leading-none text-white">{valor}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-primary-100/60">{etiqueta}</p>
    </div>
  </div>
);

const Aviso = ({ tipo, children }) => (
  <p
    role={tipo === "error" ? "alert" : "status"}
    className={`rounded-lg border px-3 py-2 text-sm ${
      tipo === "error"
        ? "border-red-800 bg-red-950/60 text-red-300"
        : "border-green-800 bg-green-950/50 text-green-300"
    }`}
  >
    {children}
  </p>
);

const Compras = () => {
  const [compras, setCompras] = useState(null); // null = cargando
  const [error, setError] = useState("");
  const [visibles, setVisibles] = useState(PASO);

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

  const totalGastado = useMemo(() => (compras ?? []).reduce((suma, c) => suma + Number(c.total), 0), [compras]);

  if (compras === null) return <p className="py-10 text-center text-surface-400">Cargando…</p>;

  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Resumen icono="bi-ticket-perforated-fill" valor={compras.length} etiqueta="Compras realizadas" />
        <Resumen icono="bi-cash-coin" valor={soles(totalGastado)} etiqueta="Total gastado" />
      </div>

      {error && <Aviso tipo="error">No pudimos cargar tus compras: {error}</Aviso>}

      {compras.length === 0 ? (
        <div className="rounded-2xl border border-primary-700/40 bg-surface-900 px-6 py-14 text-center">
          <i className="bi bi-film text-4xl text-primary-500" aria-hidden="true" />
          <p className="mb-4 mt-3 text-surface-300">Todavía no tienes compras.</p>
          <Link to="/#estrenos" className="font-bold text-accent-400 hover:underline">
            Ver estrenos
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary-700/40 bg-primary-900/30">
          {/* Encabezado de la tabla (escritorio) */}
          <div className="hidden grid-cols-[2fr_1fr_1.2fr_1fr_auto] gap-4 border-b border-primary-800/60 px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-100/60 md:grid">
            <span>Detalle</span>
            <span>Fecha</span>
            <span>Función</span>
            <span className="text-right">Total</span>
            <span className="w-10 text-center">Ticket</span>
          </div>

          <ul className="divide-y divide-primary-800/50">
            {compras.slice(0, visibles).map((c) => (
              <li
                key={c.id}
                className="grid items-center gap-x-4 gap-y-2 px-5 py-4 md:grid-cols-[2fr_1fr_1.2fr_1fr_auto] md:px-6"
              >
                <div className="flex items-start gap-3">
                  <i className="bi bi-ticket-perforated-fill mt-0.5 text-lg text-accent-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{c.titulo}</p>
                    <p className="text-xs text-surface-400">
                      Butacas: {c.asientos.join(", ")} · {c.codigo}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-surface-300">
                  <span className="text-xs text-surface-500 md:hidden">Fecha: </span>
                  {c.fecha}
                </p>
                <p className="text-sm text-surface-300">
                  {c.hora} · {c.sala}
                </p>
                <p className="font-bold text-accent-400 md:text-right">{soles(c.total)}</p>
                <Link
                  to={`/ticket/${c.id}`}
                  aria-label={`Ver ticket de ${c.titulo}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-600/60 text-white transition-colors hover:bg-primary-600 md:mx-auto"
                >
                  <i className="bi bi-qr-code" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          {visibles < compras.length && (
            <div className="border-t border-primary-800/60 py-5 text-center">
              <button
                type="button"
                onClick={() => setVisibles((v) => v + PASO)}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-500"
              >
                <i className="bi bi-plus-lg" aria-hidden="true" />
                Ver más
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Datos = () => {
  const { usuario, actualizarNombre, cambiarPassword } = useAuth();
  const [nombre, setNombre] = useState(usuario.nombre === usuario.email ? "" : usuario.nombre);
  const [aviso, setAviso] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [avisoClave, setAvisoClave] = useState(null);
  const [cambiando, setCambiando] = useState(false);

  const guardarNombre = async (e) => {
    e.preventDefault();
    setAviso(null);
    setGuardando(true);
    try {
      await actualizarNombre(nombre);
      setAviso({ tipo: "ok", texto: "Tus datos se guardaron." });
    } catch (err) {
      setAviso({ tipo: "error", texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const guardarClave = async (e) => {
    e.preventDefault();
    setAvisoClave(null);
    if (clave.length < 6) return setAvisoClave({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." });
    if (clave !== clave2) return setAvisoClave({ tipo: "error", texto: "Las contraseñas no coinciden." });
    setCambiando(true);
    try {
      await cambiarPassword(clave);
      setClave("");
      setClave2("");
      setAvisoClave({ tipo: "ok", texto: "Tu contraseña se actualizó." });
    } catch (err) {
      setAvisoClave({ tipo: "error", texto: err.message });
    } finally {
      setCambiando(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={guardarNombre} className="flex flex-col gap-4 rounded-2xl border border-primary-700/40 bg-primary-900/30 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <i className="bi bi-person-vcard-fill text-accent-400" aria-hidden="true" />
          Datos personales
        </h2>

        <label className="block">
          <span className="text-sm text-surface-300">Nombre</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            autoComplete="name"
            placeholder="Tu nombre"
            className={`${campo} mt-1`}
          />
        </label>

        <label className="block">
          <span className="text-sm text-surface-300">Correo electrónico</span>
          <input type="email" value={usuario.email} disabled className={`${campo} mt-1`} />
          <span className="mt-1 block text-xs text-surface-500">El correo es tu usuario y no se puede cambiar.</span>
        </label>

        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}

        <button
          type="submit"
          disabled={guardando}
          className="mt-auto rounded-full bg-accent-400 px-6 py-3 font-bold text-black transition-colors hover:bg-accent-300 disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      <form onSubmit={guardarClave} className="flex flex-col gap-4 rounded-2xl border border-primary-700/40 bg-primary-900/30 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <i className="bi bi-shield-lock-fill text-accent-400" aria-hidden="true" />
          Cambiar contraseña
        </h2>

        <label className="block">
          <span className="text-sm text-surface-300">Nueva contraseña</span>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            className={`${campo} mt-1`}
          />
        </label>

        <label className="block">
          <span className="text-sm text-surface-300">Repite la contraseña</span>
          <input
            type="password"
            value={clave2}
            onChange={(e) => setClave2(e.target.value)}
            required
            autoComplete="new-password"
            className={`${campo} mt-1`}
          />
        </label>

        {avisoClave && <Aviso tipo={avisoClave.tipo}>{avisoClave.texto}</Aviso>}

        <button
          type="submit"
          disabled={cambiando}
          className="mt-auto rounded-full border-2 border-primary-500 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
        >
          {cambiando ? "Actualizando…" : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
};

const Perfil = () => {
  const { usuario } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "compras";

  return (
    <main className="min-h-screen px-4 pb-16 pt-28 text-white sm:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Cabecera del perfil */}
        <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <span
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold text-white shadow-lg shadow-primary-900/60 ring-4 ring-accent-400/80"
            aria-hidden="true"
          >
            {iniciales(usuario.nombre)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{usuario.nombre}</h1>
            <p className="truncate text-sm text-primary-100/60">{usuario.email}</p>
          </div>
        </header>

        {/* Pestañas */}
        <div role="tablist" aria-label="Secciones del perfil" className="mt-10 flex gap-6 border-b border-primary-800/60">
          {TABS.map((t) => {
            const activa = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => setParams({ tab: t.id }, { replace: true })}
                className={`-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition-colors sm:text-base ${
                  activa
                    ? "border-accent-400 text-white"
                    : "border-transparent text-primary-100/60 hover:text-white"
                }`}
              >
                <i className={`bi ${t.icono}`} aria-hidden="true" />
                {t.titulo}
              </button>
            );
          })}
        </div>

        <div className="mt-8" role="tabpanel">
          {tab === "compras" ? <Compras /> : <Datos />}
        </div>
      </div>
    </main>
  );
};

export default Perfil;
