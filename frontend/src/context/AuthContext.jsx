import { createContext, useContext, useEffect, useState } from "react";
import * as auth from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    auth.sesionActual().then((u) => {
      setUsuario(u);
      setCargando(false);
    });
    return auth.alCambiarSesion(setUsuario);
  }, []);

  const valor = {
    usuario,
    cargando,
    ingresar: auth.ingresar,
    registrar: auth.registrar,
    salir: auth.salir,
    actualizarDatos: auth.actualizarDatos,
    cambiarPassword: auth.cambiarPassword,
    enviarCorreoRecuperacion: auth.enviarCorreoRecuperacion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
