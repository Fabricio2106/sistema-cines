import { useState } from "react";
import toast from "react-hot-toast";
import { GENEROS_PELICULA, PELICULAS } from "../datos";
import { BotonIcono, BotonPrimario, Campo, Insignia, Modal, Tabla, TituloPagina, Tarjeta, entrada } from "../ui";

const VACIA = { id: "", titulo: "", genero: "Acción", clasificacion: "", estreno: "", trailerUrl: "", poster: "", activa: true };

// MAQUETA: los cambios viven solo en memoria y se pierden al recargar la página.
const Peliculas = () => {
  const [lista, setLista] = useState(PELICULAS);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null); // null = cerrado; objeto = abierto
  const nueva = editando && !editando.id;

  const visibles = lista.filter((p) => p.titulo.toLowerCase().includes(busqueda.trim().toLowerCase()));

  const alternar = (id) => {
    setLista((prev) => prev.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p)));
  };

  const guardar = (e) => {
    e.preventDefault();
    if (nueva) {
      setLista((prev) => [{ ...editando, id: editando.titulo.toLowerCase().replace(/\s+/g, "-"), trailer: Boolean(editando.trailerUrl) }, ...prev]);
    } else {
      setLista((prev) => prev.map((p) => (p.id === editando.id ? { ...p, ...editando, trailer: Boolean(editando.trailerUrl) || p.trailer } : p)));
    }
    toast.success(nueva ? "Película agregada (maqueta)" : "Cambios guardados (maqueta)");
    setEditando(null);
  };

  const cambiar = (e) => setEditando({ ...editando, [e.target.name]: e.target.value });

  return (
    <>
      <TituloPagina titulo="Películas" descripcion="Controla qué se ve en la cartelera, con su póster, tráiler y fecha de estreno.">
        <BotonPrimario onClick={() => setEditando({ ...VACIA })}>
          <i className="bi bi-plus-lg" aria-hidden="true" />
          Nueva película
        </BotonPrimario>
      </TituloPagina>

      <Tarjeta className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-800/60 p-4">
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
          <p className="text-sm text-primary-100/60">
            {visibles.length} de {lista.length} películas
          </p>
        </div>

        <Tabla columnas={["Película", "Género", "Clasif.", "Estreno", "Tráiler", "Estado", "Acciones"]}>
          {visibles.map((p) => (
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
                  <BotonIcono icono="bi-pencil-fill" etiqueta={`Editar ${p.titulo}`} onClick={() => setEditando({ ...p, trailerUrl: "" })} />
                  <BotonIcono
                    icono={p.activa ? "bi-eye-slash-fill" : "bi-eye-fill"}
                    etiqueta={p.activa ? `Ocultar ${p.titulo}` : `Mostrar ${p.titulo}`}
                    onClick={() => alternar(p.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      </Tarjeta>

      <Modal
        abierto={Boolean(editando)}
        onCerrar={() => setEditando(null)}
        titulo={nueva ? "Nueva película" : "Editar película"}
        descripcion="Maqueta: los datos no se guardan en la base de datos."
      >
        {editando && (
          <form onSubmit={guardar} className="space-y-4">
            <Campo etiqueta="Título">
              <input name="titulo" value={editando.titulo} onChange={cambiar} required className={entrada} />
            </Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Género">
                <select name="genero" value={editando.genero} onChange={cambiar} className={entrada}>
                  {GENEROS_PELICULA.map((g) => (
                    <option key={g} className="text-black">
                      {g}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo etiqueta="Clasificación">
                <input name="clasificacion" value={editando.clasificacion} onChange={cambiar} placeholder="ATP, 14+, 18+…" className={entrada} />
              </Campo>
              <Campo etiqueta="Fecha de estreno">
                <input name="estreno" type="date" value={editando.estreno} onChange={cambiar} className={`${entrada} [color-scheme:dark]`} />
              </Campo>
              <Campo etiqueta="Enlace del tráiler (YouTube)">
                <input name="trailerUrl" value={editando.trailerUrl} onChange={cambiar} placeholder="https://youtube.com/…" className={entrada} />
              </Campo>
            </div>

            <Campo etiqueta="Póster (vertical)">
              <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-primary-700/60 bg-black/20 p-4">
                {editando.poster ? (
                  <img src={editando.poster} alt="" className="h-20 w-14 rounded-md object-cover" />
                ) : (
                  <span className="flex h-20 w-14 items-center justify-center rounded-md bg-primary-900 text-2xl text-primary-400">
                    <i className="bi bi-image" aria-hidden="true" />
                  </span>
                )}
                <div className="text-sm">
                  <p className="font-semibold">Subir imagen</p>
                  <p className="text-primary-100/50">Se guardará en Supabase Storage cuando se conecte el panel.</p>
                </div>
              </div>
            </Campo>

            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={editando.activa}
                onChange={(e) => setEditando({ ...editando, activa: e.target.checked })}
                className="h-4 w-4 accent-yellow-400"
              />
              Visible en la cartelera
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditando(null)} className="rounded-full border border-primary-600/60 px-5 py-2.5 text-sm font-semibold hover:bg-primary-600">
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

export default Peliculas;
