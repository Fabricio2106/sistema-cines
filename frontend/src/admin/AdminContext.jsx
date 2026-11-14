import { createContext, useContext, useState } from "react";
import { ROLES } from "./datos";

// MAQUETA: la "sesión" del panel es solo un rol guardado en el navegador. No hay cuentas ni permisos reales.
const AdminContext = createContext(null);
const CLAVE = "maqueta-admin-rol";

const leerRol = () => {
  try {
    const rol = sessionStorage.getItem(CLAVE);
    return rol in ROLES ? rol : null;
  } catch {
    return null;
  }
};

export const AdminProvider = ({ children }) => {
  const [rol, setRol] = useState(leerRol);

  const guardar = (nuevo) => {
    try {
      if (nuevo) sessionStorage.setItem(CLAVE, nuevo);
      else sessionStorage.removeItem(CLAVE);
    } catch {
      /* sin almacenamiento: la sesión dura solo mientras la página siga abierta */
    }
    setRol(nuevo);
  };

  return (
    <AdminContext.Provider value={{ rol, ingresar: guardar, cambiarRol: guardar, salir: () => guardar(null) }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
