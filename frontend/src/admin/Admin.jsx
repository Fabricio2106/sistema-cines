import { Navigate, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./AdminContext";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import Resumen from "./paginas/Resumen";
import Peliculas from "./paginas/Peliculas";
import Funciones from "./paginas/Funciones";
import Ventas from "./paginas/Ventas";
import Validar from "./paginas/Validar";

// MAQUETA del panel de administración: pantallas con datos de ejemplo, sin conexión a Supabase.
const Admin = () => (
  <AdminProvider>
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route index element={<Resumen />} />
        <Route path="peliculas" element={<Peliculas />} />
        <Route path="funciones" element={<Funciones />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="validar" element={<Validar />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </AdminProvider>
);

export default Admin;
