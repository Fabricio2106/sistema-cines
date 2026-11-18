import { createContext, useContext, useEffect, useState } from "react";
import { cargarCartelera } from "../services/cartelera";
import { suscribirCartelera } from "../services/tiempoReal";

const CarteleraContext = createContext(null);

export const CarteleraProvider = ({ children }) => {
  const [estado, setEstado] = useState({ cargando: true, error: "", peliculas: [], salas: {} });

  useEffect(() => {
    let activo = true;
    let temporizador;

    // Una recarga en segundo plano (por un cambio en vivo) nunca borra lo que ya se ve:
    // si falla, se conserva la cartelera actual.
    const cargar = (enSegundoPlano) =>
      cargarCartelera()
        .then((datos) => activo && setEstado({ cargando: false, error: "", ...datos }))
        .catch((err) => {
          if (activo && !enSegundoPlano) setEstado((prev) => ({ ...prev, cargando: false, error: err.message }));
        });

    cargar(false);

    // Varios cambios seguidos (por ejemplo al editar una película y sus funciones) se
    // juntan en una sola recarga.
    const alCambiar = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => cargar(true), 500);
    };
    const dejarDeEscuchar = suscribirCartelera(alCambiar);

    return () => {
      activo = false;
      clearTimeout(temporizador);
      dejarDeEscuchar();
    };
  }, []);

  const valor = {
    ...estado,
    buscarPelicula: (id) => estado.peliculas.find((p) => p.id === id),
  };

  return <CarteleraContext.Provider value={valor}>{children}</CarteleraContext.Provider>;
};

export const useCartelera = () => useContext(CarteleraContext);
