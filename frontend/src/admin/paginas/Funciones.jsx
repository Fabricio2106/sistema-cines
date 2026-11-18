import { useState } from "react";
import toast from "react-hot-toast";
import SelectorHora from "../../components/SelectorHora/SelectorHora";
import SelectorNumero from "../../components/SelectorNumero/SelectorNumero";
import TablaDatos from "../../components/TablaDatos/TablaDatos";
import { soles } from "../constantes";
import { useFunciones, usePeliculas, useSalas } from "../hooks";
import { BotonFiltros, BotonIcono, BotonPrimario, Campo, Desplegable, EstadoCarga, Insignia, Modal, PanelFiltros, TituloPagina, Tarjeta, entrada } from "../ui";

const FILTROS_VACIOS = { pelicula: "", sala: "", estado: "", turno: "" };

// Mañana: antes de las 12:00. Tarde: de 12:00 a 17:59. Noche: desde las 18:00.
const turnoDe = (hora) => {
  const h = Number(hora.slice(0, 2));
  return h < 12 ? "manana" : h < 18 ? "tarde" : "noche";
};

const cumpleFiltros = (f, filtros) =>
  (!filtros.pelicula || f.peliculaId === filtros.pelicula) &&
  (!filtros.sala || String(f.sala) === filtros.sala) &&
  (!filtros.estado || (filtros.estado === "activas" ? f.activa : !f.activa)) &&
  (!filtros.turno || turnoDe(f.hora) === filtros.turno);

const Funciones = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [verFiltros, setVerFiltros] = useState(false);
  const { datos: todas, cargando: cargandoFunciones, error, crear, actualizar } = useFunciones();
  const { datos: peliculas, cargando: cargandoPeliculas } = usePeliculas();
  const cargando = cargandoFunciones || cargandoPeliculas;
  const { datos: salas } = useSalas();
  const [nueva, setNueva] = useState(null);

  // Regla: una película desactivada no se ofrece para crear funciones, ni como filtro, ni se
  // muestran sus funciones en la tabla (dejan de verse en la web mientras esté desactivada).
  const peliculasActivas = peliculas.filter((p) => p.activa);
  const idsActivas = new Set(peliculasActivas.map((p) => p.id));
  const funciones = todas.filter((f) => idsActivas.has(f.peliculaId));

  const filtrosActivos = Object.values(filtros).filter(Boolean).length;
  const visibles = funciones.filter(
    (f) => f.pelicula.toLowerCase().includes(busqueda.trim().toLowerCase()) && cumpleFiltros(f, filtros)
  );

  const peliculasConFunciones = [...new Map(funciones.map((f) => [f.peliculaId, f.pelicula]))]
    .map(([valor, etiqueta]) => ({ valor, etiqueta }))
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta));

  const camposFiltro = [
    { name: "pelicula", etiqueta: "Película", opciones: [{ valor: "", etiqueta: "Todas" }, ...peliculasConFunciones] },
    { name: "sala", etiqueta: "Sala", opciones: [{ valor: "", etiqueta: "Todas" }, ...salas.map((s) => ({ valor: s.id, etiqueta: s.nombre }))] },
    {
      name: "estado",
      etiqueta: "Estado",
      opciones: [
        { valor: "", etiqueta: "Todos" },
        { valor: "activas", etiqueta: "Activas" },
        { valor: "pausadas", etiqueta: "Pausadas" },
      ],
    },
    {
      name: "turno",
      etiqueta: "Horario",
      opciones: [
        { valor: "", etiqueta: "Todos" },
        { valor: "manana", etiqueta: "Mañana", detalle: "Antes de las 12:00" },
        { valor: "tarde", etiqueta: "Tarde", detalle: "De 12:00 a 17:59" },
        { valor: "noche", etiqueta: "Noche", detalle: "Desde las 18:00" },
      ],
    },
  ];

  const cambiarFiltro = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await crear({ ...nueva, activa: true });
      toast.success("Función agregada");
      setNueva(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const alternar = async (f) => {
    try {
      await actualizar(f.id, { activa: !f.activa });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cambiar = (e) => setNueva({ ...nueva, [e.target.name]: e.target.value });

  const columnas = [
    { titulo: "Película", clase: "font-semibold", celda: (f) => f.pelicula },
    { titulo: "Hora", celda: (f) => f.hora },
    { titulo: "Sala", celda: (f) => salas.find((s) => s.id === f.sala)?.nombre ?? `Sala ${f.sala}` },
    { titulo: "Precio", clase: "font-bold text-accent-400", celda: (f) => soles(f.precio) },
    { titulo: "Estado", celda: (f) => <Insignia activa={f.activa} textoInactiva="Pausada" /> },
    {
      titulo: "Acciones",
      celda: (f) => (
        <div className="flex gap-2">
          <BotonIcono
            icono={f.activa ? "bi-pause-fill" : "bi-play-fill"}
            etiqueta={f.activa ? "Pausar función" : "Reactivar función"}
            onClick={() => alternar(f)}
          />
        </div>
      ),
    },
  ];

  return (
    // En escritorio la página ocupa la pantalla y la tabla se desplaza por dentro.
    <div className="flex flex-col gap-4 lg:h-full">
      <TituloPagina compacto titulo="Funciones" descripcion="Horarios y precios de cada película en cartelera.">
        <BotonPrimario
          disabled={peliculasActivas.length === 0}
          title={peliculasActivas.length === 0 ? "No hay películas activas para programar" : undefined}
          onClick={() => setNueva({ peliculaId: peliculasActivas[0]?.id ?? "", hora: "18:00", sala: salas[0]?.id ?? 1, precio: 15 })}
        >
          <i className="bi bi-plus-lg" aria-hidden="true" />
          Nueva función
        </BotonPrimario>
      </TituloPagina>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <i className="bi bi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" aria-hidden="true" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar película"
              aria-label="Buscar película"
              className={`${entrada} pl-11`}
            />
          </div>
          <BotonFiltros abierto={verFiltros} activos={filtrosActivos} onClick={() => setVerFiltros((v) => !v)} />
        </div>
        <p className="text-sm text-primary-100/60">
          {visibles.length} de {funciones.length} funciones
        </p>
      </div>

      {verFiltros && (
        <PanelFiltros campos={camposFiltro} valores={filtros} onCambio={cambiarFiltro} onLimpiar={() => setFiltros(FILTROS_VACIOS)} />
      )}

      {cargando || error ? (
        <EstadoCarga cargando={cargando} error={error} />
      ) : (
        <Tarjeta className="flex min-h-0 flex-col overflow-hidden lg:flex-1">
          <TablaDatos
            className="lg:min-h-0 lg:flex-1"
            columnas={columnas}
            filas={visibles}
            claveFila={(f) => f.id}
            claseFila={(f) => (f.activa ? "" : "opacity-60")}
            vacio={busqueda.trim() || filtrosActivos > 0 ? "Ninguna función coincide con la búsqueda y los filtros." : "Todavía no hay funciones."}
          />
        </Tarjeta>
      )}

      <Modal abierto={Boolean(nueva)} onCerrar={() => setNueva(null)} titulo="Nueva función" descripcion="Aparece en la cartelera en cuanto la guardes.">
        {nueva && (
          <form onSubmit={guardar} className="space-y-4">
            <Campo etiqueta="Película">
              <Desplegable
                name="peliculaId"
                value={nueva.peliculaId}
                onChange={cambiar}
                opciones={peliculasActivas.map((p) => ({ valor: p.id, etiqueta: p.titulo }))}
              />
            </Campo>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Campo etiqueta="Hora">
                <SelectorHora name="hora" value={nueva.hora} onChange={cambiar} />
              </Campo>
              <Campo etiqueta="Sala">
                <Desplegable
                  name="sala"
                  value={nueva.sala}
                  onChange={cambiar}
                  opciones={salas.map((x) => ({ valor: x.id, etiqueta: x.nombre }))}
                />
              </Campo>
              <Campo etiqueta="Precio">
                <SelectorNumero name="precio" value={nueva.precio} onChange={cambiar} prefijo="S/" min={0} required />
              </Campo>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setNueva(null)} className="rounded-full border border-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">
                Cancelar
              </button>
              <button type="submit" className="rounded-full bg-accent-400 px-6 py-2.5 text-sm font-bold text-black hover:bg-accent-300">
                Guardar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Funciones;
