import toast from "react-hot-toast";
import { COMPRAS, VENTAS_SEMANA, soles } from "../datos";
import { Indicador, Insignia, Tabla, TituloPagina, Tarjeta } from "../ui";

const Ventas = () => {
  const entradas = VENTAS_SEMANA.reduce((s, d) => s + d.entradas, 0);
  const ingresos = VENTAS_SEMANA.reduce((s, d) => s + d.ingresos, 0);

  return (
    <>
      <TituloPagina titulo="Ventas" descripcion="Compras de los clientes en la web. Datos de ejemplo de los últimos 7 días.">
        <button
          type="button"
          onClick={() => toast("La exportación estará disponible al conectar el panel")}
          className="inline-flex items-center gap-2 rounded-full border border-primary-600/60 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-primary-600"
        >
          <i className="bi bi-download" aria-hidden="true" />
          Exportar
        </button>
      </TituloPagina>

      <div className="grid gap-4 sm:grid-cols-3">
        <Indicador icono="bi-ticket-perforated-fill" valor={entradas} etiqueta="Entradas vendidas" />
        <Indicador icono="bi-cash-coin" valor={soles(ingresos)} etiqueta="Ingresos" />
        <Indicador icono="bi-receipt" valor={soles(Math.round(ingresos / entradas))} etiqueta="Precio promedio por entrada" />
      </div>

      <Tarjeta className="mt-6 overflow-hidden">
        <div className="border-b border-primary-800/60 px-6 py-4">
          <h2 className="text-lg font-bold">Compras recientes</h2>
        </div>
        <Tabla columnas={["Código", "Cliente", "Película y función", "Butacas", "Total", "Entrada"]}>
          {COMPRAS.map((c) => (
            <tr key={c.codigo}>
              <td className="px-5 py-3 font-mono font-bold tracking-widest text-accent-400">{c.codigo}</td>
              <td className="px-5 py-3">{c.cliente}</td>
              <td className="px-5 py-3">
                <span className="block font-semibold">{c.pelicula}</span>
                <span className="text-xs text-primary-100/60">{c.funcion}</span>
              </td>
              <td className="px-5 py-3">{c.asientos}</td>
              <td className="px-5 py-3 font-bold">{soles(c.total)}</td>
              <td className="px-5 py-3">
                <Insignia activa={!c.usada} textoActiva="Sin usar" textoInactiva="Usada" />
              </td>
            </tr>
          ))}
        </Tabla>
      </Tarjeta>
    </>
  );
};

export default Ventas;
