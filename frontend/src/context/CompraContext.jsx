import { createContext, useContext, useState } from "react";

// Lo que el cliente va eligiendo durante la compra: { peliculaId, funcionId, asientos, fecha }.
// Se guarda en sessionStorage para que sobreviva a un refresco de la página y para que, al
// volver de "Resumen" a "Butacas", la selección siga ahí.
const CompraContext = createContext(null);
const CLAVE = "compra-en-curso";

const esCompraValida = (c) =>
  c &&
  typeof c.peliculaId === "string" &&
  typeof c.funcionId === "string" &&
  typeof c.fecha === "string" &&
  Array.isArray(c.asientos) &&
  c.asientos.every((a) => typeof a === "string");

const leer = () => {
  try {
    const guardada = JSON.parse(sessionStorage.getItem(CLAVE));
    return esCompraValida(guardada) ? guardada : null;
  } catch {
    return null;
  }
};

const escribir = (compra) => {
  try {
    if (compra) sessionStorage.setItem(CLAVE, JSON.stringify(compra));
    else sessionStorage.removeItem(CLAVE);
  } catch {
    /* sin almacenamiento: la compra dura solo mientras la página siga abierta */
  }
};

export const CompraProvider = ({ children }) => {
  const [compra, setCompra] = useState(leer);

  const guardar = (nueva) => {
    escribir(nueva);
    setCompra(nueva);
  };

  const valor = {
    compra,
    elegirButacas: (datos) => guardar(datos),
    limpiar: () => guardar(null),
  };

  return <CompraContext.Provider value={valor}>{children}</CompraContext.Provider>;
};

export const useCompra = () => useContext(CompraContext);
