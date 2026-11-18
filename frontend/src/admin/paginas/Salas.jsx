import toast from "react-hot-toast";
import { useSalas } from "../hooks";
import { BotonIcono, EstadoCarga, TituloPagina, Tarjeta } from "../ui";

const Salas = () => {
  const { datos: salas, cargando, error } = useSalas();

  return (
    // En escritorio la página ocupa la pantalla y las salas se desplazan por dentro si no caben.
    <div className="flex flex-col gap-4 lg:h-full">
      <TituloPagina compacto titulo="Salas" descripcion="Distribución de butacas de cada sala." />

      {cargando || error ? (
        <EstadoCarga cargando={cargando} error={error} />
      ) : salas.length === 0 ? (
        <p className="py-10 text-center text-sm text-primary-100/60">Todavía no hay salas.</p>
      ) : (
        <div className="scroll-cine grid grid-cols-1 content-start gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:overflow-y-auto">
          {salas.map((s) => (
            <Tarjeta key={s.id} className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{s.nombre}</h2>
                  <p className="text-sm text-primary-100/60">
                    {s.filas.length} filas × {s.porFila} butacas = {s.filas.length * s.porFila} butacas
                  </p>
                </div>
                <BotonIcono icono="bi-pencil-fill" etiqueta={`Editar ${s.nombre}`} onClick={() => toast("La edición de salas todavía no está disponible")} />
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
    </div>
  );
};

export default Salas;
