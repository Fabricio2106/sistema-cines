import { Navigate, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./AdminContext";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import Resumen from "./paginas/Resumen";
import Peliculas from "./paginas/Peliculas";
import Funciones from "./paginas/Funciones";
import Salas from "./paginas/Salas";
import Ventas from "./paginas/Ventas";
import Validar from "./paginas/Validar";

// Panel de administración. Solo entra el personal registrado en la tabla `personal` (backend/supabase/admin.sql).
const Admin = () => (
  <AdminProvider>
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route index element={<Resumen />} />
        <Route path="peliculas" element={<Peliculas />} />
        <Route path="funciones" element={<Funciones />} />
        <Route path="salas" element={<Salas />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="validar" element={<Validar />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </AdminProvider>
);

export default Admin;
