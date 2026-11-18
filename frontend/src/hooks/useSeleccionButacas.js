import { useEffect, useState } from "react";
import { asientosOcupados } from "../services/compras";

// Estado de la elección de butacas de una función: cuáles están ocupadas (según el
// servidor), cuáles eligió el cliente y el límite por compra.
// `alLlegarAlLimite` avisa a la pantalla (por ejemplo con un toast) sin acoplar el hook a la interfaz.
export const useSeleccionButacas = ({ peliculaId, funcionId, fecha, maximo, inicial = [], alLlegarAlLimite }) => {
  const [seleccion, setSeleccion] = useState(inicial);
  const [ocupadas, setOcupadas] = useState([]);

  useEffect(() => {
    let activo = true;
    asientosOcupados(peliculaId, funcionId, fecha).then((lista) => {
      if (!activo) return;
      setOcupadas(lista);
      // Si alguien compró una butaca que tenías elegida, se quita de tu selección
      setSeleccion((prev) => prev.filter((a) => !lista.includes(a)));
    });
    return () => {
      activo = false;
    };
  }, [peliculaId, funcionId, fecha]);

  const alternar = (asiento) => {
    if (ocupadas.includes(asiento)) return;
    if (!seleccion.includes(asiento) && seleccion.length >= maximo) {
      alLlegarAlLimite?.(maximo);
      return;
    }
    setSeleccion((prev) => (prev.includes(asiento) ? prev.filter((a) => a !== asiento) : [...prev, asiento]));
  };

  return { seleccion, ocupadas, alternar };
};
