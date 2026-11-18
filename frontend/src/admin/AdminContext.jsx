import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { alCambiarSesion, ingresar as iniciarSesion, salir as cerrarSesion } from "../services/auth";
import { rolDePersonal } from "./repositorios/personal";

// El panel usa la misma sesión de Supabase que el sitio. El rol sale de la tabla `personal`
// en el servidor: si la cuenta no está ahí, no entra, y aunque alguien editara este archivo
// en su navegador, las reglas de la base de datos (admin.sql) rechazarían sus consultas.
const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [estado, setEstado] = useState({ cargando: true, rol: null });

  const refrescar = useCallback(async () => {
    try {
      setEstado({ cargando: false, rol: await rolDePersonal() });
    } catch {
      setEstado({ cargando: false, rol: null });
    }
  }, []);

  useEffect(() => {
    return alCambiarSesion((usuario) => {
      if (!usuario) return setEstado({ cargando: false, rol: null });
      // Supabase no admite llamar a su API dentro de este aviso: se difiere un instante.
      setTimeout(refrescar, 0);
    });
  }, [refrescar]);

  // Lanza un error si las credenciales fallan o si la cuenta no es del personal.
  const ingresar = async (credenciales) => {
    await iniciarSesion(credenciales);
    const rol = await rolDePersonal();
    if (!rol) {
      await cerrarSesion();
      throw new Error("Esta cuenta no tiene acceso al panel");
    }
    setEstado({ cargando: false, rol });
    return rol;
  };

  const salir = async () => {
    await cerrarSesion();
    setEstado({ cargando: false, rol: null });
  };

  return <AdminContext.Provider value={{ ...estado, ingresar, salir }}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
