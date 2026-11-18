import * as Popover from "@radix-ui/react-popover";
import { useEffect, useRef, useState } from "react";

const dos = (n) => String(n).padStart(2, "0");

const HORAS = Array.from({ length: 24 }, (_, h) => dos(h));

// Una columna de opciones que se desplaza y, al abrirse, deja a la vista la opción elegida.
const Columna = ({ titulo, opciones, elegida, onElegir }) => {
  const contenedor = useRef(null);

  useEffect(() => {
    const el = contenedor.current?.querySelector("[data-elegida]");
    if (el) contenedor.current.scrollTop = el.offsetTop - contenedor.current.clientHeight / 2 + el.clientHeight / 2;
  }, []);

  return (
    <div>
      <p className="mb-1.5 text-center text-xs font-bold uppercase tracking-wider text-primary-100/50">{titulo}</p>
      <div ref={contenedor} className="scroll-cine relative flex max-h-56 flex-col gap-1 overflow-y-auto overflow-x-hidden pr-1">
        {opciones.map((o) => (
          <button
            key={o}
            type="button"
            data-elegida={o === elegida ? "" : undefined}
            aria-pressed={o === elegida}
            onClick={() => onElegir(o)}
            className={`h-9 w-14 shrink-0 rounded-lg text-sm transition-colors ${
              o === elegida ? "bg-accent-400 font-bold text-black" : "text-primary-100/80 hover:bg-primary-600 hover:text-white"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
};

// Campo para elegir una hora en formato 24 horas ("HH:MM"): un botón que muestra la hora y abre
// dos columnas, horas y minutos. Reemplaza a <input type="time"> (cuyo menú no se puede diseñar).
//   <SelectorHora name="hora" value={hora} onChange={cambiar} />
// `onChange` recibe { target: { name, value } }, igual que un evento de formulario. `paso` son los
// minutos entre una opción y otra (5 por defecto). Se elige la hora y luego los minutos, y al
// elegir los minutos el menú se cierra.
const SelectorHora = ({ name, value, onChange, placeholder = "--:--", paso = 5, className = "" }) => {
  const [abierto, setAbierto] = useState(false);
  const [hora, minuto] = value ? value.split(":") : ["", ""];

  const minutos = Array.from({ length: Math.ceil(60 / paso) }, (_, i) => dos(i * paso));
  // Si la hora guardada tiene minutos fuera del paso (por ejemplo 18:07), se muestra igual para no perderla.
  if (minuto && !minutos.includes(minuto)) minutos.push(minuto);
  minutos.sort();

  const poner = (h, m) => onChange({ target: { name, value: `${h}:${m}` } });

  return (
    <Popover.Root open={abierto} onOpenChange={setAbierto}>
      <Popover.Trigger
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-primary-950/70 px-4 py-2.5 text-left transition-colors focus:outline-none focus:ring-1 focus:ring-accent-400 data-[state=open]:border-accent-400 ${
          value ? "border-accent-400/70 text-white" : "border-primary-800/70 text-surface-500"
        } ${className}`}
      >
        <span>{value || placeholder}</span>
        <i className="bi bi-clock text-primary-400" aria-hidden="true" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="scroll-cine z-[70] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-2xl border border-primary-700/60 bg-primary-950 p-3 text-white shadow-2xl shadow-black/60 focus:outline-none"
        >
          <div className="flex gap-3">
            <Columna titulo="Hora" opciones={HORAS} elegida={hora} onElegir={(h) => poner(h, minuto || "00")} />
            <span className="w-px self-stretch bg-primary-800/70" aria-hidden="true" />
            <Columna
              titulo="Minutos"
              opciones={minutos}
              elegida={minuto}
              onElegir={(m) => {
                poner(hora || "00", m);
                setAbierto(false);
              }}
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default SelectorHora;
