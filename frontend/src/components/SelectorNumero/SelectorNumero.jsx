import { useEffect, useRef, useState } from "react";

// Campo para escribir o ajustar un número con botones − y +, con el estilo del sitio. Reemplaza a
// <input type="number"> (cuyas flechitas no se pueden diseñar).
//   <SelectorNumero name="precio" value={precio} onChange={cambiar} prefijo="S/" min={0} />
// `onChange` recibe { target: { name, value } } (value es texto), igual que un evento de formulario.
//   min, max   límites; al salir del campo y al usar los botones el valor se ajusta a ellos.
//   paso       cuánto suman o restan los botones y las flechas del teclado (1 por defecto).
//   prefijo    texto fijo a la izquierda, por ejemplo "S/".
// Mantener pulsado un botón repite el cambio.
const decimales = (n) => (String(n).split(".")[1] ?? "").length;

const SelectorNumero = ({ name, value, onChange, min, max, paso = 1, prefijo, required, className = "" }) => {
  const temporizador = useRef(null);
  const [presionado, setPresionado] = useState(0); // -1 = restar, 1 = sumar, 0 = ninguno
  const actual = useRef(value);
  actual.current = value;

  const ajustar = (n) => {
    let v = n;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return Number(v.toFixed(Math.max(decimales(paso), decimales(min ?? 0))));
  };

  const poner = (v) => onChange({ target: { name, value: String(v) } });

  const mover = (direccion) => {
    const base = Number(actual.current);
    poner(ajustar((Number.isFinite(base) ? base : (min ?? 0)) + direccion * paso));
  };

  const parar = () => {
    clearTimeout(temporizador.current);
    clearInterval(temporizador.current);
    setPresionado(0);
  };

  // Pulsar una vez cambia un paso; mantener pulsado repite cada 90 ms tras una pausa corta.
  const empezar = (direccion) => (e) => {
    e.preventDefault();
    parar(); // corta cualquier repetición anterior y limpia el estado "pulsado"
    setPresionado(direccion);
    mover(direccion);
    temporizador.current = setTimeout(() => {
      temporizador.current = setInterval(() => mover(direccion), 90);
    }, 400);
  };

  // Al desmontar solo se detienen los temporizadores (no se actualiza el estado).
  useEffect(
    () => () => {
      clearTimeout(temporizador.current);
      clearInterval(temporizador.current);
    },
    []
  );

  const alSalir = () => {
    const n = Number(value);
    if (value === "" || !Number.isFinite(n)) return;
    const corregido = ajustar(n);
    if (corregido !== n) poner(corregido);
  };

  // El color de "pulsado" depende del estado y no de :hover, porque en pantallas táctiles :hover se
  // queda pegado y dejaba los dos botones marcados. El resaltado al pasar el cursor solo se usa en
  // dispositivos con ratón.
  const boton = (direccion) =>
    `flex h-full w-9 shrink-0 items-center justify-center transition-colors disabled:opacity-30 ${
      presionado === direccion
        ? "bg-primary-600 text-white"
        : "text-primary-100/70 [@media(hover:hover)]:enabled:hover:bg-primary-600/60 [@media(hover:hover)]:enabled:hover:text-white"
    }`;
  const n = Number(value);
  const enMinimo = min !== undefined && Number.isFinite(n) && n <= min;
  const enMaximo = max !== undefined && Number.isFinite(n) && n >= max;

  return (
    <div
      className={`flex h-[2.75rem] items-stretch overflow-hidden rounded-xl border bg-primary-950/70 transition-colors focus-within:border-accent-400 focus-within:ring-1 focus-within:ring-accent-400 ${
        value === "" ? "border-primary-800/70" : "border-accent-400/70"
      } ${className}`}
    >
      {/* El campo va primero en el HTML (y se coloca con `order`): si el componente está dentro de un
          <label>, el control asociado es el campo y no el botón "−", que se marcaba junto con el "+". */}
      <div className="order-2 flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2">
        {prefijo && <span className="font-semibold text-primary-100/60">{prefijo}</span>}
        <input
          name={name}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={paso}
          required={required}
          onChange={(e) => onChange({ target: { name, value: e.target.value } })}
          onBlur={alSalir}
          className="w-full min-w-0 appearance-none bg-transparent text-center font-semibold text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
        />
      </div>
      <button type="button" tabIndex={-1} aria-label="Restar" disabled={enMinimo} onPointerDown={empezar(-1)} onPointerUp={parar} onPointerLeave={parar} onPointerCancel={parar} className={`order-1 ${boton(-1)} border-r border-primary-800/70`}>
        <i className="bi bi-dash-lg" aria-hidden="true" />
      </button>
      <button type="button" tabIndex={-1} aria-label="Sumar" disabled={enMaximo} onPointerDown={empezar(1)} onPointerUp={parar} onPointerLeave={parar} onPointerCancel={parar} className={`order-3 ${boton(1)} border-l border-primary-800/70`}>
        <i className="bi bi-plus-lg" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SelectorNumero;
