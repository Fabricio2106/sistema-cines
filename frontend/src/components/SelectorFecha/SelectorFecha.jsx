import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { aFecha, hoyLima } from "../../utils/fechas";
import Calendario from "../Calendario/Calendario";

const FORMATO = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric" });

// Campo para elegir una fecha: un botón que muestra la fecha y abre el calendario del sitio.
// Reemplaza a <input type="date"> (cuyo calendario no se puede diseñar).
//   <SelectorFecha name="estreno" value={estreno} onChange={cambiar} />
// `value` es "AAAA-MM-DD" o "". `onChange` recibe { target: { name, value } }, igual que un evento
// de formulario. `desde` y `hasta` limitan las fechas posibles. Con `limpiable` (por defecto) se
// puede borrar la fecha.
const SelectorFecha = ({ name, value, onChange, placeholder = "Elige una fecha", desde, hasta, limpiable = true, className = "" }) => {
  const [abierto, setAbierto] = useState(false);
  const hoy = hoyLima();
  const hoyPermitido = (!desde || hoy >= desde) && (!hasta || hoy <= hasta);

  const elegir = (iso) => {
    onChange({ target: { name, value: iso } });
    setAbierto(false);
  };

  return (
    <Popover.Root open={abierto} onOpenChange={setAbierto}>
      <Popover.Trigger
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-primary-950/70 px-4 py-2.5 text-left transition-colors focus:outline-none focus:ring-1 focus:ring-accent-400 data-[state=open]:border-accent-400 ${
          value ? "border-accent-400/70 text-white" : "border-primary-800/70 text-surface-500"
        } ${className}`}
      >
        <span className="min-w-0 truncate">{value ? FORMATO.format(aFecha(value)) : placeholder}</span>
        <i className="bi bi-calendar3 text-primary-400" aria-hidden="true" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="scroll-cine z-[70] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-2xl border border-primary-700/60 bg-primary-950 p-3 text-white shadow-2xl shadow-black/60 focus:outline-none"
        >
          <Calendario compacto valor={value} onCambio={elegir} desde={desde} hasta={hasta} />
          <div className="mt-2 flex items-center justify-between border-t border-primary-800/60 pt-3 text-sm font-semibold">
            {limpiable ? (
              <button type="button" disabled={!value} onClick={() => elegir("")} className="rounded-lg px-2 py-1 text-primary-100/80 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-primary-100/80">
                Borrar
              </button>
            ) : (
              <span />
            )}
            <button type="button" disabled={!hoyPermitido} onClick={() => elegir(hoy)} className="rounded-lg px-2 py-1 text-accent-400 transition-colors hover:text-accent-300 disabled:opacity-30">
              Hoy
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default SelectorFecha;
