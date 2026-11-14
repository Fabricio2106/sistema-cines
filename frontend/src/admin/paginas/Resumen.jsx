import { FUNCIONES, SALAS, TOP_PELICULAS, VENTAS_SEMANA, soles } from "../datos";
import { Indicador, Tabla, TituloPagina, Tarjeta } from "../ui";

const Resumen = () => {
  const hoy = VENTAS_SEMANA[VENTAS_SEMANA.length - 1];
  const maximo = Math.max(...VENTAS_SEMANA.map((d) => d.ingresos));
  const totalSemana = VENTAS_SEMANA.reduce((suma, d) => suma + d.ingresos, 0);
  const proximas = FUNCIONES.filter((f) => f.activa).slice(0, 5);

  return (
    <>
      <TituloPagina titulo="Resumen" descripcion="Cómo va el cine hoy y en los últimos 7 días." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador icono="bi-ticket-perforated-fill" valor={hoy.entradas} etiqueta="Entradas hoy" detalle="+12% vs. ayer" />
        <Indicador icono="bi-cash-coin" valor={soles(hoy.ingresos)} etiqueta="Ingresos hoy" detalle="+9% vs. ayer" />
        <Indicador icono="bi-people-fill" valor="68%" etiqueta="Ocupación promedio" />
        <Indicador icono="bi-film" valor="10" etiqueta="Películas en cartelera" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Tarjeta className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Ingresos de la semana</h2>
              <p className="text-sm text-primary-100/60">Total: {soles(totalSemana)}</p>
            </div>
          </div>
          <ul className="flex h-56 items-end gap-3" aria-label="Ingresos por día">
            {VENTAS_SEMANA.map((d) => (
              <li key={d.dia} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold text-primary-100/70">{soles(d.ingresos)}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary-700 to-primary-500"
                  style={{ height: `${(d.ingresos / maximo) * 100}%` }}
                  role="img"
                  aria-label={`${d.dia}: ${soles(d.ingresos)}`}
                />
                <span className="text-xs text-primary-100/60">{d.dia}</span>
              </li>
            ))}
          </ul>
        </Tarjeta>

        <Tarjeta className="p-6">
          <h2 className="mb-4 text-lg font-bold">Películas más vendidas</h2>
          <ol className="space-y-4">
            {TOP_PELICULAS.map((p, i) => (
              <li key={p.titulo} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600/30 text-sm font-bold text-accent-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.titulo}</p>
                  <p className="text-xs text-primary-100/60">{p.entradas} entradas</p>
                </div>
                <span className="text-sm font-bold text-accent-400">{soles(p.ingresos)}</span>
              </li>
            ))}
          </ol>
        </Tarjeta>
      </div>

      <Tarjeta className="mt-6 overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-lg font-bold">Próximas funciones de hoy</h2>
        </div>
        <div className="mt-3">
          <Tabla columnas={["Película", "Hora", "Sala", "Ocupación"]}>
            {proximas.map((f, i) => {
              const sala = SALAS.find((s) => s.id === f.sala);
              const capacidad = sala.filas.length * sala.porFila;
              const ocupadas = Math.round(capacidad * [0.82, 0.64, 0.45, 0.9, 0.37][i]);
              return (
                <tr key={f.id}>
                  <td className="px-5 py-3 font-semibold">{f.pelicula}</td>
                  <td className="px-5 py-3">{f.hora}</td>
                  <td className="px-5 py-3">{sala.nombre}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-primary-900">
                        <div className="h-full rounded-full bg-accent-400" style={{ width: `${(ocupadas / capacidad) * 100}%` }} />
                      </div>
                      <span className="text-xs text-primary-100/70">
                        {ocupadas}/{capacidad}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Tabla>
        </div>
      </Tarjeta>
    </>
  );
};

export default Resumen;
