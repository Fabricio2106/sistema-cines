import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import letras from "../assets/cinerama-letras.png";
import { useAdmin } from "./AdminContext";
import { ROLES } from "./datos";

const MENU = [
  { a: "/admin", etiqueta: "Resumen", icono: "bi-speedometer2", roles: ["admin"], fin: true },
  { a: "/admin/peliculas", etiqueta: "Películas", icono: "bi-film", roles: ["admin"] },
  { a: "/admin/funciones", etiqueta: "Funciones y salas", icono: "bi-calendar-event-fill", roles: ["admin"] },
  { a: "/admin/ventas", etiqueta: "Ventas", icono: "bi-graph-up-arrow", roles: ["admin", "boleteria"] },
  { a: "/admin/validar", etiqueta: "Validar entradas", icono: "bi-qr-code-scan", roles: ["admin", "boleteria"] },
];

const AdminLayout = () => {
  const { rol, cambiarRol, salir } = useAdmin();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!rol) return <Navigate to="/admin/login" replace />;

  const opciones = MENU.filter((m) => m.roles.includes(rol));
  // Boletería no entra a las pantallas de gestión
  const actual = MENU.find((m) => (m.fin ? pathname === m.a : pathname.startsWith(m.a)));
  if (actual && !actual.roles.includes(rol)) return <Navigate to="/admin/ventas" replace />;

  const enlace = ({ isActive }) =>
    `flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
      isActive ? "bg-primary-600 text-white shadow-md shadow-primary-900/60" : "text-primary-100/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-primary-950 text-white lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Barra lateral (escritorio) / barra superior (móvil) */}
      <aside className="border-b border-primary-800/60 bg-black/30 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:py-6">
          <Link to="/admin" aria-label="Inicio del panel">
            <img src={letras} alt="Cinerama" className="w-32 lg:w-40" />
          </Link>
          <p className="mt-0 text-xs font-bold uppercase tracking-widest text-accent-400 lg:mt-3">Panel de administración</p>
        </div>

        <nav aria-label="Secciones del panel" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4 lg:pb-0">
          {opciones.map((m) => (
            <NavLink key={m.a} to={m.a} end={m.fin} className={enlace}>
              <i className={`bi ${m.icono}`} aria-hidden="true" />
              {m.etiqueta}
            </NavLink>
          ))}
        </nav>

        <div className="hidden px-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block lg:pb-6">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-primary-100/60 transition-colors hover:bg-white/10 hover:text-white">
            <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            Ver el sitio
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Barra superior */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-800/60 px-5 py-3 sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-400/15 px-3 py-1 text-xs font-bold text-accent-400">
            <i className="bi bi-info-circle-fill" aria-hidden="true" />
            Maqueta · datos de ejemplo
          </span>

          <div className="flex items-center gap-3">
            <div className="flex rounded-full bg-primary-900/70 p-1" role="group" aria-label="Ver el panel como">
              {Object.entries(ROLES).map(([clave, nombre]) => (
                <button
                  key={clave}
                  type="button"
                  aria-pressed={rol === clave}
                  onClick={() => cambiarRol(clave)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    rol === clave ? "bg-primary-600 text-white" : "text-primary-100/60 hover:text-white"
                  }`}
                >
                  {nombre}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                salir();
                navigate("/admin/login");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-600/60 px-4 py-1.5 text-xs font-bold transition-colors hover:bg-primary-600"
            >
              <i className="bi bi-box-arrow-right" aria-hidden="true" />
              Salir
            </button>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
