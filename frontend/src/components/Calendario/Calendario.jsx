import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { aFecha, aIso } from "../../utils/fechas";

// Calendario del sitio y del panel: un solo lugar con el idioma y el estilo (clase `calendario-cine`
// en index.css). Las fechas son texto "AAAA-MM-DD".
//   valor     fecha elegida ("" si no hay)
//   onCambio  recibe la fecha elegida
//   desde     primera fecha que se puede elegir (opcional)
//   hasta     última fecha que se puede elegir (opcional)
//   compacto  días más chicos, para calendarios dentro de un menú flotante
const Calendario = ({ valor, onCambio, desde, hasta, compacto = false }) => (
  <DayPicker
    className={`calendario-cine ${compacto ? "calendario-compacto" : ""}`}
    mode="single"
    required
    locale={es}
    selected={valor ? aFecha(valor) : undefined}
    defaultMonth={valor ? aFecha(valor) : undefined}
    onSelect={(dia) => dia && onCambio(aIso(dia))}
    disabled={[desde && { before: aFecha(desde) }, hasta && { after: aFecha(hasta) }].filter(Boolean)}
    startMonth={desde ? aFecha(desde) : undefined}
    endMonth={hasta ? aFecha(hasta) : undefined}
  />
);

export default Calendario;
