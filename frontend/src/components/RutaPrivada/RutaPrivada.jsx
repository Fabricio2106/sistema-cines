import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Si no hay sesión, manda al login y vuelve a esta página (con su estado) al entrar.
const RutaPrivada = ({ children }) => {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-surface-400">Cargando…</div>
    );
  }
  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export default RutaPrivada;
