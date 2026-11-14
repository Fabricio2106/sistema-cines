import * as Dialog from "@radix-ui/react-dialog";

// Piezas visuales compartidas por las pantallas del panel (maqueta).

export const entrada =
  "w-full rounded-xl border border-primary-800/70 bg-primary-950/70 px-4 py-2.5 text-white placeholder-surface-500 transition-colors focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400";

export const TituloPagina = ({ titulo, descripcion, children }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">{titulo}</h1>
      {descripcion && <p className="mt-1 text-sm text-primary-100/60">{descripcion}</p>}
    </div>
    {children}
  </div>
);

export const Tarjeta = ({ children, className = "" }) => (
  <section className={`rounded-2xl border border-primary-700/40 bg-primary-900/30 ${className}`}>{children}</section>
);

export const Indicador = ({ icono, valor, etiqueta, detalle }) => (
  <Tarjeta className="flex items-center gap-4 p-5">
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600/25 text-xl text-accent-400">
      <i className={`bi ${icono}`} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-2xl font-bold leading-none">{valor}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-primary-100/60">{etiqueta}</p>
      {detalle && <p className="mt-1 text-xs text-green-400">{detalle}</p>}
    </div>
  </Tarjeta>
);

export const Insignia = ({ activa, textoActiva = "Activa", textoInactiva = "Oculta" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
      activa ? "bg-green-500/15 text-green-400" : "bg-surface-700/60 text-surface-400"
    }`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${activa ? "bg-green-400" : "bg-surface-500"}`} aria-hidden="true" />
    {activa ? textoActiva : textoInactiva}
  </span>
);

export const BotonIcono = ({ icono, etiqueta, ...props }) => (
  <button
    type="button"
    aria-label={etiqueta}
    title={etiqueta}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary-700/50 text-primary-100/80 transition-colors hover:bg-primary-600 hover:text-white"
    {...props}
  >
    <i className={`bi ${icono}`} aria-hidden="true" />
  </button>
);

export const BotonPrimario = ({ children, ...props }) => (
  <button
    type="button"
    className="inline-flex items-center gap-2 rounded-full bg-accent-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300"
    {...props}
  >
    {children}
  </button>
);

export const Campo = ({ etiqueta, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-primary-100/70">{etiqueta}</span>
    {children}
  </label>
);

// Ventana modal (Radix Dialog) con la paleta del sitio.
export const Modal = ({ abierto, onCerrar, titulo, descripcion, children }) => (
  <Dialog.Root open={abierto} onOpenChange={(v) => !v && onCerrar()}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" />
      <Dialog.Content
        aria-describedby={descripcion ? undefined : undefined}
        className="fixed left-1/2 top-1/2 z-[61] max-h-[90vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-primary-700/50 bg-primary-950 p-6 shadow-2xl shadow-black/60 focus:outline-none"
      >
        <Dialog.Title className="text-xl font-bold text-white">{titulo}</Dialog.Title>
        {descripcion ? (
          <Dialog.Description className="mt-1 text-sm text-primary-100/60">{descripcion}</Dialog.Description>
        ) : null}
        <div className="mt-5">{children}</div>
        <Dialog.Close
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-primary-100/70 transition-colors hover:bg-primary-600 hover:text-white"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const Tabla = ({ columnas, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr className="border-b border-primary-800/60 text-xs uppercase tracking-wider text-primary-100/50">
          {columnas.map((c) => (
            <th key={c} scope="col" className="px-5 py-3 font-bold">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-primary-800/40">{children}</tbody>
    </table>
  </div>
);
