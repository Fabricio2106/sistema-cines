import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { aFecha, aIso, hoyLima, ultimaFecha } from "../../utils/fechas";

// Calendario para elegir la fecha de la función: de hoy a 6 días después.
const Calendario = ({ valor, onCambio }) => (
  <DayPicker
    className="calendario-cine"
    mode="single"
    required
    locale={es}
    selected={aFecha(valor)}
    onSelect={(dia) => dia && onCambio(aIso(dia))}
    disabled={{ before: aFecha(hoyLima()), after: aFecha(ultimaFecha()) }}
    startMonth={aFecha(hoyLima())}
    endMonth={aFecha(ultimaFecha())}
  />
);

export default Calendario;
