import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CLASIFICACIONES, GENEROS_PELICULA, POSTER, validarPoster } from "../constantes";
import { usePeliculas } from "../hooks";
import SelectorFecha from "../../components/SelectorFecha/SelectorFecha";
import { hoyLima } from "../../utils/fechas";
import { BotonIcono, BotonPrimario, Campo, Desplegable, EstadoCarga, Insignia, Modal, Tabla, TituloPagina, Tarjeta, entrada } from "../ui";

const COLUMNAS = ["Película", "Género", "Clasif.", "Estreno", "Tráiler", "Estado", "Acciones"];

const FILTROS_VACIOS = { genero: "", clasificacion: "", trailer: "", estreno: "" };

// Una película cumple los filtros si cumple todos los que estén elegidos.
const cumpleFiltros = (p, f, hoy) => {
  if (f.genero && p.genero !== f.genero) return false;
  if (f.clasificacion === "ninguna" && p.clasificacion) return false;
  if (f.clasificacion && f.clasificacion !== "ninguna" && p.clasificacion !== f.clasificacion) return false;
  if (f.trailer === "con" && !p.trailer) return false;
  if (f.trailer === "sin" && p.trailer) return false;
  if (f.estreno === "proximos" && !(p.estreno && p.estreno > hoy)) return false;
  if (f.estreno === "estrenadas" && !(p.estreno && p.estreno <= hoy)) return false;
  if (f.estreno === "sin" && p.estreno) return false;
  return true;
};

const VACIA = { id: "", titulo: "", genero: "Acción", clasificacion: "", estreno: "", trailerUrl: "", poster: "", posterArchivo: null, activa: true };

// Elegir la imagen del póster, con el botón o arrastrándola a la tarjeta. Muestra el actual o la
// elegida, valida el archivo y avisa que se sube al guardar.
const SelectorPoster = ({ actual, archivo, onElegir }) => {
  const [error, setError] = useState("");
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [arrastrando, setArrastrando] = useState(false);

  useEffect(() => {
    if (!archivo) return setVistaPrevia("");
    const url = URL.createObjectURL(archivo);
    setVistaPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  const procesar = (nuevo) => {
    if (!nuevo) return;
    const motivo = validarPoster(nuevo);
    setError(motivo);
    if (!motivo) onElegir(nuevo);
  };

  const elegir = (e) => {
    const nuevo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    procesar(nuevo);
  };

  const soltar = (e) => {
    e.preventDefault();
    setArrastrando(false);
    procesar(e.dataTransfer.files?.[0]); // si sueltan varios, se usa el primero
  };

  const imagen = vistaPrevia || actual;

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-primary-100/70">Póster (vertical)</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setArrastrando(false);
        }}
        onDrop={soltar}
        className={`relative flex items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors ${
          arrastrando ? "border-accent-400 bg-accent-400/10" : "border-primary-600/60 bg-primary-900/50"
        }`}
      >
        {arrastrando && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-xl bg-primary-950 text-accent-400">
            <i className="bi bi-cloud-arrow-up-fill text-3xl" aria-hidden="true" />
            <span className="text-sm font-bold">Suelta la imagen aquí</span>
          </div>
        )}
        {imagen ? (
          <img src={imagen} alt="Vista del póster" className="h-28 w-[4.67rem] shrink-0 rounded-md object-cover shadow-lg shadow-black/50" />
        ) : (
          <span className="flex h-28 w-[4.67rem] shrink-0 items-center justify-center rounded-md bg-primary-900 text-2xl text-primary-400">
            <i className="bi bi-image" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-white">
            {archivo ? "Póster nuevo" : actual ? "Póster actual" : "Esta película no tiene póster"}
          </p>
          <p className="mt-0.5 text-xs text-primary-100/70">
            {archivo ? (
              <>
                <span className="break-all">{archivo.name}</span> · se sube al guardar. Puedes arrastrar otra imagen para cambiarla.
              </>
            ) : (
              "Arrastra una imagen hasta aquí o usa el botón. JPG, PNG o WEBP, máximo 3 MB. Mejor vertical (2:3), por ejemplo 800 × 1200 px."
            )}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-400 px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-accent-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white">
              <i className="bi bi-upload" aria-hidden="true" />
              {actual || archivo ? "Cambiar imagen" : "Subir imagen"}
              <input type="file" accept={Object.keys(POSTER.tipos).join(",")} onChange={elegir} className="sr-only" />
            </label>
            {archivo && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  onElegir(null);
                }}
                className="rounded-full border border-primary-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
};

const Peliculas = () => {
  const { datos: lista, cargando, error, crear, actualizar } = usePeliculas();
  const [vista, setVista] = useState("activas"); // "activas" | "desactivadas"
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [verFiltros, setVerFiltros] = useState(false);
  const [editando, setEditando] = useState(null); // null = cerrado; objeto = abierto
  const [guardando, setGuardando] = useState(false);
  const nueva = editando && !editando.id;

  const hoy = hoyLima();
  const filtrosActivos = Object.values(filtros).filter(Boolean).length;
  const generos = [...new Set(lista.map((p) => p.genero))].sort();

  const visibles = lista.filter(
    (p) => p.titulo.toLowerCase().includes(busqueda.trim().toLowerCase()) && cumpleFiltros(p, filtros, hoy)
  );
  const activas = visibles.filter((p) => p.activa);
  const desactivadas = visibles.filter((p) => !p.activa);
  const mostradas = vista === "activas" ? activas : desactivadas;

  const alternar = async (p) => {
    try {
      await actualizar(p.id, { activa: !p.activa });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (nueva) await crear(editando);
      else await actualizar(editando.id, editando);
      toast.success(nueva ? "Película agregada" : "Cambios guardados");
      setEditando(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiar = (e) => setEditando({ ...editando, [e.target.name]: e.target.value });

  const filas = (peliculas) =>
    peliculas.map((p) => (
      <tr key={p.id} className={p.activa ? "" : "opacity-60"}>
        <td className="px-5 py-3">
          <div className="flex items-center gap-3">
            {p.poster ? (
              <img src={p.poster} alt="" className="h-14 w-10 shrink-0 rounded-md object-cover" />
            ) : (
              <span className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md bg-primary-900 text-primary-400">
                <i className="bi bi-image" aria-hidden="true" />
              </span>
            )}
            <span className="font-semibold">{p.titulo}</span>
          </div>
        </td>
        <td className="px-5 py-3">{p.genero}</td>
        <td className="px-5 py-3">{p.clasificacion || "—"}</td>
        <td className="px-5 py-3">{p.estreno || "—"}</td>
        <td className="px-5 py-3">
          {p.trailer ? <i className="bi bi-check-circle-fill text-green-400" aria-label="Tiene tráiler" /> : "—"}
        </td>
        <td className="px-5 py-3">
          <Insignia activa={p.activa} />
        </td>
        <td className="px-5 py-3">
          <div className="flex gap-2">
            <BotonIcono icono="bi-pencil-fill" etiqueta={`Editar ${p.titulo}`} onClick={() => setEditando({ ...p })} />
            <BotonIcono
              icono={p.activa ? "bi-eye-slash-fill" : "bi-eye-fill"}
              etiqueta={p.activa ? `Ocultar ${p.titulo}` : `Mostrar ${p.titulo}`}
              onClick={() => alternar(p)}
            />
          </div>
        </td>
      </tr>
    ));

  const vacio = (texto) => (
    <p className="px-5 py-6 text-center text-sm text-primary-100/60">
      {busqueda.trim() || filtrosActivos > 0 ? "Ninguna película coincide con la búsqueda y los filtros." : texto}
    </p>
  );

  const cambiarFiltro = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  return (
    // En escritorio la página ocupa la pantalla y cada tabla se desplaza por dentro.
    <div className="flex flex-col gap-4 lg:h-full">
      <TituloPagina compacto titulo="Películas" descripcion="Controla qué se ve en la cartelera, con su póster, tráiler y fecha de estreno.">
        <BotonPrimario onClick={() => setEditando({ ...VACIA })}>
          <i className="bi bi-plus-lg" aria-hidden="true" />
          Nueva película
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
          <button
            type="button"
            aria-expanded={verFiltros}
            onClick={() => setVerFiltros((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              verFiltros || filtrosActivos > 0
                ? "border-accent-400 bg-accent-400/10 text-white"
                : "border-primary-700/60 text-primary-100/80 hover:bg-primary-600 hover:text-white"
            }`}
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Filtros
            {filtrosActivos > 0 && (
              <span className="rounded-full bg-accent-400 px-2 py-0.5 text-xs font-bold text-black">{filtrosActivos}</span>
            )}
          </button>
        </div>
        <p className="text-sm text-primary-100/60">
          {visibles.length} de {lista.length} películas
        </p>
      </div>

      {verFiltros && (
        <Tarjeta className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Campo etiqueta="Género">
              <Desplegable
                name="genero"
                value={filtros.genero}
                onChange={cambiarFiltro}
                opciones={[{ valor: "", etiqueta: "Todos" }, ...generos.map((g) => ({ valor: g, etiqueta: g }))]}
              />
            </Campo>
            <Campo etiqueta="Clasificación">
              <Desplegable
                name="clasificacion"
                value={filtros.clasificacion}
                onChange={cambiarFiltro}
                opciones={[
                  { valor: "", etiqueta: "Todas" },
                  { valor: "ninguna", etiqueta: "Sin clasificación" },
                  ...CLASIFICACIONES.map((c) => ({ valor: c.valor, etiqueta: c.valor, detalle: c.nombre })),
                ]}
              />
            </Campo>
            <Campo etiqueta="Tráiler">
              <Desplegable
                name="trailer"
                value={filtros.trailer}
                onChange={cambiarFiltro}
                opciones={[
                  { valor: "", etiqueta: "Todas" },
                  { valor: "con", etiqueta: "Con tráiler" },
                  { valor: "sin", etiqueta: "Sin tráiler" },
                ]}
              />
            </Campo>
            <Campo etiqueta="Estreno">
              <Desplegable
                name="estreno"
                value={filtros.estreno}
                onChange={cambiarFiltro}
                opciones={[
                  { valor: "", etiqueta: "Todos" },
                  { valor: "proximos", etiqueta: "Próximos estrenos" },
                  { valor: "estrenadas", etiqueta: "Ya estrenadas" },
                  { valor: "sin", etiqueta: "Sin fecha de estreno" },
                ]}
              />
            </Campo>
          </div>
          {filtrosActivos > 0 && (
            <button type="button" onClick={() => setFiltros(FILTROS_VACIOS)} className="mt-4 text-sm font-semibold text-accent-400 hover:underline">
              Limpiar filtros
            </button>
          )}
        </Tarjeta>
      )}

      {cargando || error ? (
        <EstadoCarga cargando={cargando} error={error} />
      ) : (
        <>
          <Tarjeta className="flex min-h-0 flex-col overflow-hidden lg:flex-1">
            <div role="tablist" aria-label="Películas por estado" className="flex gap-6 border-b border-primary-800/60 px-5">
              {[
                ["activas", "En cartelera", activas.length, "bi-eye-fill"],
                ["desactivadas", "Desactivadas", desactivadas.length, "bi-eye-slash-fill"],
              ].map(([id, texto, cantidad, icono]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={vista === id}
                  onClick={() => setVista(id)}
                  className={`-mb-px flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold transition-colors ${
                    vista === id ? "border-accent-400 text-white" : "border-transparent text-primary-100/60 hover:text-white"
                  }`}
                >
                  <i className={`bi ${icono}`} aria-hidden="true" />
                  {texto}
                  <span className="rounded-full bg-primary-600/30 px-2 py-0.5 text-xs">{cantidad}</span>
                </button>
              ))}
            </div>

            {vista === "desactivadas" && (
              <p className="border-b border-primary-800/60 px-5 py-2 text-xs text-primary-100/50">
                Estas películas no se ven en la web. Pulsa el ojo para volver a mostrarlas.
              </p>
            )}

            {mostradas.length === 0 ? (
              vacio(vista === "activas" ? "No hay películas en cartelera." : "No hay películas desactivadas.")
            ) : (
              <Tabla className="lg:min-h-0 lg:flex-1" columnas={COLUMNAS}>
                {filas(mostradas)}
              </Tabla>
            )}
          </Tarjeta>
        </>
      )}

      <Modal
        abierto={Boolean(editando)}
        onCerrar={() => setEditando(null)}
        titulo={nueva ? "Nueva película" : "Editar película"}
        descripcion="Los cambios se ven en la cartelera en cuanto los guardes."
      >
        {editando && (
          <form onSubmit={guardar} className="space-y-4">
            <Campo etiqueta="Título">
              <input name="titulo" value={editando.titulo} onChange={cambiar} required className={entrada} />
            </Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Género">
<Desplegable name="genero" value={editando.genero} onChange={cambiar} opciones={GENEROS_PELICULA} />
              </Campo>
              <Campo etiqueta="Clasificación">
                <Desplegable
                  name="clasificacion"
                  value={editando.clasificacion}
                  onChange={cambiar}
                  opciones={[
                    { valor: "", etiqueta: "Sin clasificación", detalle: "No se muestra insignia en la web" },
                    ...CLASIFICACIONES.map((c) => ({ valor: c.valor, etiqueta: c.valor, detalle: c.nombre })),
                    // Un valor fuera de la lista (dato antiguo) se muestra para poder cambiarlo.
                    ...(editando.clasificacion && !CLASIFICACIONES.some((c) => c.valor === editando.clasificacion)
                      ? [{ valor: editando.clasificacion, etiqueta: editando.clasificacion, detalle: "Valor anterior: elige uno de la lista" }]
                      : []),
                  ]}
                />
              </Campo>
              <Campo etiqueta="Fecha de estreno">
                <SelectorFecha name="estreno" value={editando.estreno} onChange={cambiar} placeholder="Sin fecha" />
              </Campo>
              <Campo etiqueta="Enlace del tráiler (YouTube)">
                <input name="trailerUrl" value={editando.trailerUrl} onChange={cambiar} placeholder="https://youtube.com/…" className={entrada} />
              </Campo>
            </div>

            {CLASIFICACIONES.filter((c) => c.valor === editando.clasificacion).map((c) => (
              <p key={c.valor} className="flex items-start gap-2 rounded-xl border border-primary-700/40 bg-primary-900/30 px-4 py-3 text-xs text-primary-100/70">
                <i className="bi bi-info-circle-fill mt-0.5 text-accent-400" aria-hidden="true" />
                <span>
                  <strong className="text-white">{c.valor}</strong> · {c.nombre}. {c.descripcion}
                </span>
              </p>
            ))}

            <SelectorPoster
              actual={editando.poster}
              archivo={editando.posterArchivo}
              onElegir={(archivo) => setEditando({ ...editando, posterArchivo: archivo })}
            />

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-primary-600/60 bg-primary-900/50 px-4 py-3">
              <span>
                <span className="block text-sm font-semibold text-white">Visible en la cartelera</span>
                <span className="block text-xs text-primary-100/70">
                  {editando.activa ? "Se ve en la web." : "No se ve en la web: queda en Desactivadas."}
                </span>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={editando.activa}
                onChange={(e) => setEditando({ ...editando, activa: e.target.checked })}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-6 w-11 shrink-0 rounded-full bg-surface-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-accent-400 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-primary-950"
              />
            </label>

            {/* Los botones quedan siempre a la vista, aunque el formulario sea largo */}
            <div className="sticky bottom-0 -mx-6 !-mb-6 flex justify-end gap-3 border-t border-primary-800/60 bg-primary-950 px-6 pb-6 pt-4">
              <button type="button" disabled={guardando} onClick={() => setEditando(null)} className="rounded-full border border-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
                Cancelar
              </button>
              <button type="submit" disabled={guardando} className="rounded-full bg-accent-400 px-6 py-2.5 text-sm font-bold text-black hover:bg-accent-300 disabled:opacity-60">
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Peliculas;
