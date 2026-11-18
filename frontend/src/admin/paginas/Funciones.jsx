import { useState } from "react";
import toast from "react-hot-toast";
import { soles } from "../constantes";
import { useFunciones, usePeliculas, useSalas } from "../hooks";
import { BotonIcono, BotonPrimario, Campo, EstadoCarga, Insignia, Modal, Tabla, TituloPagina, Tarjeta, entrada } from "../ui";

const Funciones = () => {
  const [tab, setTab] = useState("funciones");
  const { datos: funciones, cargando, error, crear, actualizar } = useFunciones();
  const { datos: peliculas } = usePeliculas();
  const { datos: salas } = useSalas();
  const [nueva, setNueva] = useState(null);

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

  return (
    <>
      <TituloPagina titulo="Funciones y salas" descripcion="Horarios, precios y distribución de las salas.">
        {tab === "funciones" && (
          <BotonPrimario onClick={() => setNueva({ peliculaId: peliculas[0]?.id ?? "", hora: "18:00", sala: salas[0]?.id ?? 1, precio: 15 })}>
            <i className="bi bi-plus-lg" aria-hidden="true" />
            Nueva función
          </BotonPrimario>
        )}
      </TituloPagina>

      <div role="tablist" aria-label="Funciones y salas" className="mb-6 flex gap-6 border-b border-primary-800/60">
        {[
          ["funciones", "Funciones", "bi-calendar-event-fill"],
          ["salas", "Salas", "bi-grid-3x3-gap-fill"],
        ].map(([id, texto, icono]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
              tab === id ? "border-accent-400 text-white" : "border-transparent text-primary-100/60 hover:text-white"
            }`}
          >
            <i className={`bi ${icono}`} aria-hidden="true" />
            {texto}
          </button>
        ))}
      </div>

      <EstadoCarga cargando={cargando} error={error} />

      {tab === "funciones" ? (
        <Tarjeta className="overflow-hidden">
          <Tabla columnas={["Película", "Hora", "Sala", "Precio", "Estado", "Acciones"]}>
            {funciones.map((f) => (
              <tr key={f.id} className={f.activa ? "" : "opacity-60"}>
                <td className="px-5 py-3 font-semibold">{f.pelicula}</td>
                <td className="px-5 py-3">{f.hora}</td>
                <td className="px-5 py-3">Sala {f.sala}</td>
                <td className="px-5 py-3 font-bold text-accent-400">{soles(f.precio)}</td>
                <td className="px-5 py-3">
                  <Insignia activa={f.activa} textoInactiva="Pausada" />
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <BotonIcono
                      icono={f.activa ? "bi-pause-fill" : "bi-play-fill"}
                      etiqueta={f.activa ? "Pausar función" : "Reactivar función"}
                      onClick={() => alternar(f)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Tabla>
        </Tarjeta>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {salas.map((s) => (
            <Tarjeta key={s.id} className="p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{s.nombre}</h2>
                  <p className="text-sm text-primary-100/60">
                    {s.filas.length} filas × {s.porFila} butacas = {s.filas.length * s.porFila} butacas
                  </p>
                </div>
                <BotonIcono icono="bi-pencil-fill" etiqueta={`Editar ${s.nombre}`} onClick={() => toast("Edición de salas disponible al conectar el panel")} />
              </div>
              <div className="mb-3 h-1.5 rounded-full bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
              <p className="mb-4 text-center text-[10px] tracking-widest text-primary-100/50">PANTALLA</p>
              <div className="flex flex-col items-center gap-1.5 overflow-x-auto pb-1">
                {s.filas.map((fila) => (
                  <div key={fila} className="flex items-center gap-1">
                    <span className="w-4 text-[10px] text-primary-100/50">{fila}</span>
                    {Array.from({ length: s.porFila }, (_, i) => (
                      <span key={i} className="h-4 w-4 rounded-t-md bg-primary-700/70 sm:h-5 sm:w-5" />
                    ))}
                  </div>
                ))}
              </div>
            </Tarjeta>
          ))}
        </div>
      )}

      <Modal abierto={Boolean(nueva)} onCerrar={() => setNueva(null)} titulo="Nueva función" descripcion="Aparece en la cartelera en cuanto la guardes.">
        {nueva && (
          <form onSubmit={guardar} className="space-y-4">
            <Campo etiqueta="Película">
              <select name="peliculaId" value={nueva.peliculaId} onChange={cambiar} className={entrada}>
                {peliculas.map((p) => (
                  <option key={p.id} value={p.id} className="text-black">
                    {p.titulo}
                  </option>
                ))}
              </select>
            </Campo>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Campo etiqueta="Hora">
                <input name="hora" type="time" value={nueva.hora} onChange={cambiar} required className={`${entrada} [color-scheme:dark]`} />
              </Campo>
              <Campo etiqueta="Sala">
                <select name="sala" value={nueva.sala} onChange={cambiar} className={entrada}>
                  {salas.map((s) => (
                    <option key={s.id} value={s.id} className="text-black">
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo etiqueta="Precio (S/)">
                <input name="precio" type="number" min="0" value={nueva.precio} onChange={cambiar} required className={entrada} />
              </Campo>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setNueva(null)} className="rounded-full border border-primary-600/60 px-5 py-2.5 text-sm font-semibold hover:bg-primary-600">
                Cancelar
              </button>
              <button type="submit" className="rounded-full bg-accent-400 px-6 py-2.5 text-sm font-bold text-black hover:bg-accent-300">
                Guardar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default Funciones;
