import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CarteleraProvider } from "./context/CarteleraContext.jsx";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer.jsx";
import ScrollToHash from "./components/ScrollToHash/ScrollToHash.jsx";
import RutaPrivada from "./components/RutaPrivada/RutaPrivada.jsx";
import ErrorConfiguracion from "./components/ErrorConfiguracion/ErrorConfiguracion.jsx";
import { configurado } from "./services/supabase.js";
import Inicio from "./pages/Inicio.jsx";

const Pelicula = lazy(() => import("./pages/Pelicula.jsx"));
const Butacas = lazy(() => import("./pages/Butacas.jsx"));
const Resumen = lazy(() => import("./pages/Resumen.jsx"));
const Ticket = lazy(() => import("./pages/Ticket.jsx"));
const Perfil = lazy(() => import("./pages/Perfil.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const RecuperarContrasena = lazy(() => import("./pages/RecuperarContrasena.jsx"));
const RestablecerContrasena = lazy(() => import("./pages/RestablecerContrasena.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
const LibroReclamaciones = lazy(() => import("./pages/LibroReclamaciones.jsx"));
const Normas = lazy(() => import("./pages/Normas.jsx"));
const ComoLlegarPagina = lazy(() => import("./pages/ComoLlegarPagina.jsx"));

// Páginas a pantalla completa: sin header ni footer
const RUTAS_SIN_MARCO = ["/login", "/recuperar-contrasena", "/restablecer-contrasena"];

const Marco = ({ children }) => {
  const { pathname } = useLocation();
  return RUTAS_SIN_MARCO.includes(pathname) ? null : children;
};

const Cargando = () => (
  <div className="min-h-screen flex items-center justify-center text-surface-400">Cargando…</div>
);

function App() {
  if (!configurado) return <ErrorConfiguracion />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <CarteleraProvider>
        <ScrollToHash />
        <Marco><Navbar /></Marco>
        <Suspense fallback={<Cargando />}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/pelicula/:id" element={<Pelicula />} />
            <Route path="/pelicula/:id/butacas/:funcionId" element={<Butacas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
            <Route path="/normas" element={<Normas />} />
            <Route path="/como-llegar" element={<ComoLlegarPagina />} />
            <Route path="/legal/:tema" element={<Legal />} />
            <Route path="/libro-de-reclamaciones" element={<LibroReclamaciones />} />
            <Route path="/resumen" element={<RutaPrivada><Resumen /></RutaPrivada>} />
            <Route path="/ticket/:id" element={<RutaPrivada><Ticket /></RutaPrivada>} />
            <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />
            <Route path="/mis-entradas" element={<Navigate to="/perfil?tab=compras" replace />} />
          </Routes>
        </Suspense>
        <Marco><Footer /></Marco>
        </CarteleraProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
