// Encabezado común de las páginas informativas (normas, legales, reclamaciones, cómo llegar).
const EncabezadoPagina = ({ icono, titulo, descripcion, children }) => (
  <header className="mb-10 text-center">
    <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600/25 text-3xl text-accent-400 ring-1 ring-primary-600/40">
      <i className={`bi ${icono}`} aria-hidden="true" />
    </span>
    <h1 className="text-3xl font-bold text-white sm:text-4xl">{titulo}</h1>
    <div className="mx-auto mt-3 h-1 w-20 rounded bg-accent-400" aria-hidden="true" />
    {descripcion && <p className="mx-auto mt-4 max-w-xl text-primary-100/60">{descripcion}</p>}
    {children}
  </header>
);

export default EncabezadoPagina;
