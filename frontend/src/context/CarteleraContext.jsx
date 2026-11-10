import { createContext, useContext, useEffect, useState } from "react";
import { cargarCartelera } from "../services/cartelera";

const CarteleraContext = createContext(null);

export const CarteleraProvider = ({ children }) => {
  const [estado, setEstado] = useState({ cargando: true, error: "", peliculas: [], salas: {} });

  useEffect(() => {
    let activo = true;
    cargarCartelera()
      .then((datos) => activo && setEstado({ cargando: false, error: "", ...datos }))
      .catch((err) => activo && setEstado((prev) => ({ ...prev, cargando: false, error: err.message })));
    return () => {
      activo = false;
    };
  }, []);

  const valor = {
    ...estado,
    buscarPelicula: (id) => estado.peliculas.find((p) => p.id === id),
  };

  return <CarteleraContext.Provider value={valor}>{children}</CarteleraContext.Provider>;
};

export const useCartelera = () => useContext(CarteleraContext);
