import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const MisEntradas = lazy(() => import("./pages/MisEntradas.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

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
        <Navbar />
        <Suspense fallback={<Cargando />}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/pelicula/:id" element={<Pelicula />} />
            <Route path="/pelicula/:id/butacas/:funcionId" element={<Butacas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resumen" element={<RutaPrivada><Resumen /></RutaPrivada>} />
            <Route path="/ticket/:id" element={<RutaPrivada><Ticket /></RutaPrivada>} />
            <Route path="/mis-entradas" element={<RutaPrivada><MisEntradas /></RutaPrivada>} />
          </Routes>
        </Suspense>
        <Footer />
        </CarteleraProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
