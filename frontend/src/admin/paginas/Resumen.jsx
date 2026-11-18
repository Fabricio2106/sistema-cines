import { soles } from "../constantes";
import { useFunciones, useOcupacionHoy, usePeliculas, useSalas, useTopPeliculas, useVentasSemana } from "../hooks";
import { EstadoCarga, Indicador, TituloPagina, Tarjeta } from "../ui";
import { funcionYaEmpezo, hoyLima } from "../../utils/fechas";

// "+12% vs. ayer"; sin comparación si ayer no hubo ventas.
const contraAyer = (hoy, ayer) => {
  if (!ayer) return undefined;
  const cambio = Math.round(((hoy - ayer) / ayer) * 100);
  return `${cambio > 0 ? "+" : ""}${cambio}% vs. ayer`;
};

const Resumen = () => {
  const ventas = useVentasSemana();
  const top = useTopPeliculas();
  const ocupacion = useOcupacionHoy();
  const funciones = useFunciones();
  const salas = useSalas();
  const peliculas = usePeliculas();

  const consultas = [ventas, top, ocupacion, funciones, salas, peliculas];
  const cargando = consultas.some((c) => c.cargando);
  const error = consultas.find((c) => c.error)?.error ?? "";

  if (cargando || error) {
    return (
      <>
        <TituloPagina titulo="Resumen" descripcion="Cómo va el cine hoy y en los últimos 7 días." />
        <EstadoCarga cargando={cargando} error={error} />
      </>
    );
  }

  const semana = ventas.datos;
  const hoy = semana[semana.length - 1];
  const ayer = semana[semana.length - 2];
  const maximo = Math.max(1, ...semana.map((d) => d.ingresos));
  const totalSemana = semana.reduce((suma, d) => suma + d.ingresos, 0);
  const enCartelera = peliculas.datos.filter((p) => p.activa).length;

  const capacidadDe = (f) => {
    const sala = salas.datos.find((s) => s.id === f.sala);
    return sala ? sala.filas.length * sala.porFila : 0;
  };
  const vendidas = (f) => ocupacion.datos[f.id] ?? 0;

  // Solo cuentan las funciones activas de películas activas (las demás no se ven en la web).
  const idsActivas = new Set(peliculas.datos.filter((p) => p.activa).map((p) => p.id));
  const deHoy = funciones.datos.filter((f) => f.activa && idsActivas.has(f.peliculaId));
  const capacidadTotal = deHoy.reduce((suma, f) => suma + capacidadDe(f), 0);
  const ocupacionPromedio = capacidadTotal
    ? Math.round((deHoy.reduce((suma, f) => suma + vendidas(f), 0) / capacidadTotal) * 100)
    : null;

  const proximas = deHoy
    .filter((f) => !funcionYaEmpezo(hoyLima(), f.hora))
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 5);

  return (
    // En pantallas grandes (xl) todo el resumen cabe en la pantalla sin desplazarse; en pantallas
    // chicas las tarjetas se apilan y la página se desplaza.
    <div className="flex flex-col gap-4 xl:h-full xl:gap-5">
      <TituloPagina compacto titulo="Resumen" descripcion="Cómo va el cine hoy y en los últimos 7 días." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <Indicador icono="bi-ticket-perforated-fill" valor={hoy.entradas} etiqueta="Entradas hoy" detalle={contraAyer(hoy.entradas, ayer?.entradas)} />
        <Indicador icono="bi-cash-coin" valor={soles(hoy.ingresos)} etiqueta="Ingresos hoy" detalle={contraAyer(hoy.ingresos, ayer?.ingresos)} />
        <Indicador icono="bi-people-fill" valor={ocupacionPromedio === null ? "—" : `${ocupacionPromedio}%`} etiqueta="Ocupación promedio de hoy" />
        <Indicador icono="bi-film" valor={enCartelera} etiqueta="Películas en cartelera" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[1.5fr_1fr_1.1fr] xl:gap-5">
        <Tarjeta className="flex min-h-0 flex-col p-4 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Ingresos de la semana</h2>
              <p className="text-sm text-primary-100/60">Total: {soles(totalSemana)}</p>
            </div>
          </div>
          <ul className="flex h-56 items-end gap-1.5 sm:gap-3 xl:h-auto xl:min-h-0 xl:flex-1" aria-label="Ingresos por día">
            {semana.map((d, i) => (
              <li key={`${d.dia}-${i}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-semibold text-primary-100/70 sm:text-xs">
                  <span className="sm:hidden">{d.ingresos >= 1000 ? `${(d.ingresos / 1000).toFixed(1)}k` : d.ingresos}</span>
                  <span className="hidden sm:inline">{soles(d.ingresos)}</span>
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary-700 to-primary-500"
                  style={{ height: `${Math.max((d.ingresos / maximo) * 100, 1)}%` }}
                  role="img"
                  aria-label={`${d.dia}: ${soles(d.ingresos)}`}
                />
                <span className="text-xs text-primary-100/60">{d.dia}</span>
              </li>
            ))}
          </ul>
        </Tarjeta>

        <Tarjeta className="flex min-h-0 flex-col p-5">
          <h2 className="mb-4 text-lg font-bold">Películas más vendidas</h2>
          {top.datos.length === 0 ? (
            <p className="text-sm text-primary-100/60">Todavía no hay ventas en los últimos 7 días.</p>
          ) : (
            <ol className="scroll-cine min-h-0 space-y-3 xl:overflow-y-auto">
              {top.datos.map((p, i) => (
                <li key={p.titulo} className="flex items-center gap-3">
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
          )}
        </Tarjeta>

        <Tarjeta className="flex min-h-0 flex-col p-5">
          <h2 className="mb-4 text-lg font-bold">Próximas funciones de hoy</h2>
          {proximas.length === 0 ? (
            <p className="text-sm text-primary-100/60">No quedan funciones por empezar hoy.</p>
          ) : (
            <ul className="scroll-cine min-h-0 space-y-3 xl:overflow-y-auto">
              {proximas.map((f) => {
                const sala = salas.datos.find((s) => s.id === f.sala);
                const capacidad = capacidadDe(f);
                const ocupadas = vendidas(f);
                return (
                  <li key={f.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate font-semibold">{f.pelicula}</p>
                      <span className="shrink-0 text-sm font-bold text-accent-400">{f.hora}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary-900">
                        <div className="h-full rounded-full bg-accent-400" style={{ width: `${capacidad ? (ocupadas / capacidad) * 100 : 0}%` }} />
                      </div>
                      <span className="shrink-0 text-xs text-primary-100/70">
                        {sala?.nombre ?? `Sala ${f.sala}`} · {ocupadas}/{capacidad}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>
      </div>
    </div>
  );
};

export default Resumen;
