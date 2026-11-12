import { useEffect, useRef, useState } from "react";

// Lista desplegable con el estilo del sitio (el <select> nativo no permite diseñar sus opciones).
// `className` son las clases del botón; deben incluir el espacio izquierdo para el ícono, si lo hay.
const Selector = ({ value, onChange, opciones, placeholder = "Selecciona", name, className = "" }) => {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);
  const raiz = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => {
      if (raiz.current && !raiz.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, [abierto]);

  const abrir = () => {
    setActivo(Math.max(opciones.indexOf(value), 0));
    setAbierto(true);
  };

  const elegir = (opcion) => {
    onChange({ target: { name, value: opcion } });
    setAbierto(false);
  };

  const teclado = (e) => {
    if (e.key === "Escape") return setAbierto(false);
    if (!["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) return undefined;
    e.preventDefault();
    if (!abierto) return abrir();
    if (e.key === "ArrowDown") setActivo((i) => (i + 1) % opciones.length);
    else if (e.key === "ArrowUp") setActivo((i) => (i - 1 + opciones.length) % opciones.length);
    else if (activo >= 0) elegir(opciones[activo]);
    return undefined;
  };

  return (
    <div ref={raiz} className="relative">
      <button
        type="button"
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={teclado}
        className={`flex items-center justify-between text-left ${className} ${value ? "" : "text-surface-500"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <i
          className={`bi bi-chevron-down ml-2 text-xs text-primary-400 transition-transform duration-200 ${
            abierto ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {abierto && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-primary-700/60 bg-primary-950 py-1 shadow-2xl shadow-black/60"
        >
          {opciones.map((opcion, i) => {
            const elegida = opcion === value;
            return (
              <li
                key={opcion}
                role="option"
                aria-selected={elegida}
                onMouseEnter={() => setActivo(i)}
                onClick={(e) => {
                  e.preventDefault(); // evita que el <label> que envuelve al selector lo vuelva a abrir
                  elegir(opcion);
                }}
                className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  i === activo ? "bg-primary-600 text-white" : "text-primary-100/80"
                } ${elegida ? "font-semibold" : ""}`}
              >
                {opcion}
                {elegida && <i className="bi bi-check-lg text-accent-400" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Selector;
