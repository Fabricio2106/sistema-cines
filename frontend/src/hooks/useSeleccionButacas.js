import { useEffect, useRef, useState } from "react";
import { asientosOcupados } from "../services/compras";
import { suscribirOcupacion } from "../services/tiempoReal";

// Estado de la elección de butacas de una función: cuáles están ocupadas (según el
// servidor, y en vivo cuando alguien más compra), cuáles eligió el cliente y el límite por compra.
// `alLlegarAlLimite` y `alPerderButacas` avisan a la pantalla (por ejemplo con un toast)
// sin acoplar el hook a la interfaz.
export const useSeleccionButacas = ({
  peliculaId,
  funcionId,
  fecha,
  maximo,
  inicial = [],
  alLlegarAlLimite,
  alPerderButacas,
}) => {
  const [seleccion, setSeleccion] = useState(inicial);
  const [ocupadas, setOcupadas] = useState([]);

  // Referencias para que la suscripción lea siempre la selección y el aviso más recientes.
  const seleccionRef = useRef(seleccion);
  const avisoRef = useRef(alPerderButacas);
  useEffect(() => {
    seleccionRef.current = seleccion;
    avisoRef.current = alPerderButacas;
  });

  useEffect(() => {
    let activo = true;

    const cargar = () =>
      asientosOcupados(peliculaId, funcionId, fecha).then((lista) => {
        if (!activo) return;
        setOcupadas(lista);
        // Si alguien compró una butaca que tenías elegida, se quita de tu selección
        const perdidas = seleccionRef.current.filter((a) => lista.includes(a));
        if (perdidas.length > 0) {
          setSeleccion((prev) => prev.filter((a) => !lista.includes(a)));
          avisoRef.current?.(perdidas);
        }
      });

    cargar();
    const dejarDeEscuchar = suscribirOcupacion(peliculaId, funcionId, fecha, cargar);
    return () => {
      activo = false;
      dejarDeEscuchar();
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
