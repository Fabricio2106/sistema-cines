// Pestañas para cambiar lo que muestra una tarjeta (por ejemplo En cartelera / Desactivadas).
//   <Pestanas etiqueta="Películas por estado" activa={vista} onCambio={setVista}
//     pestanas={[{ id: "activas", texto: "En cartelera", icono: "bi-eye-fill", cantidad: 14 }]} />
// `icono` y `cantidad` son opcionales; la cantidad se muestra como un globo junto al texto.
const Pestanas = ({ pestanas, activa, onCambio, etiqueta }) => (
  <div role="tablist" aria-label={etiqueta} className="flex gap-6 border-b border-primary-800/60 px-5">
    {pestanas.map((p) => (
      <button
        key={p.id}
        type="button"
        role="tab"
        aria-selected={activa === p.id}
        onClick={() => onCambio(p.id)}
        className={`-mb-px flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold transition-colors ${
          activa === p.id ? "border-accent-400 text-white" : "border-transparent text-primary-100/60 hover:text-white"
        }`}
      >
        {p.icono && <i className={`bi ${p.icono}`} aria-hidden="true" />}
        {p.texto}
        {p.cantidad !== undefined && <span className="rounded-full bg-primary-600/30 px-2 py-0.5 text-xs">{p.cantidad}</span>}
      </button>
    ))}
  </div>
);

export default Pestanas;
