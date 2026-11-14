import { Link, Navigate, useNavigate } from "react-router-dom";
import letras from "../assets/cinerama-letras.png";
import { useAdmin } from "./AdminContext";

const campo =
  "w-full rounded-xl border border-primary-800/70 bg-primary-950/70 py-3 pl-11 pr-4 text-white placeholder-surface-500 transition-colors focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400";

const AdminLogin = () => {
  const { rol, ingresar } = useAdmin();
  const navigate = useNavigate();

  if (rol) return <Navigate to={rol === "admin" ? "/admin" : "/admin/ventas"} replace />;

  const entrar = (nuevo) => {
    ingresar(nuevo);
    navigate(nuevo === "admin" ? "/admin" : "/admin/ventas", { replace: true });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-950 px-4 py-12 text-white">
      <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary-600/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-primary-700/25 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <img src={letras} alt="Cinerama" className="mx-auto mb-8 w-48" />

        <div className="rounded-3xl border border-primary-700/40 bg-primary-900/50 p-8 shadow-2xl shadow-black/50 backdrop-blur">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-400">
            <i className="bi bi-shield-lock-fill" aria-hidden="true" />
            Acceso del personal
          </span>
          <h1 className="mt-4 text-2xl font-bold">Panel de administración</h1>
          <p className="mb-6 mt-1 text-sm text-primary-100/60">Ingresa con tu cuenta del personal para gestionar el cine.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              entrar("admin");
            }}
            className="flex flex-col gap-4"
          >
            <label className="block">
              <span className="text-sm font-medium text-primary-100/60">Correo del personal</span>
              <div className="relative mt-1.5">
                <i className="bi bi-envelope-fill pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" aria-hidden="true" />
                <input type="email" placeholder="usuario@cinerama.com.pe" className={campo} />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-primary-100/60">Contraseña</span>
              <div className="relative mt-1.5">
                <i className="bi bi-lock-fill pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" aria-hidden="true" />
                <input type="password" placeholder="••••••••" className={campo} />
              </div>
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-accent-400 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300"
            >
              Ingresar al panel
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-dashed border-primary-600/50 bg-black/20 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-100/60">Maqueta · entrar como</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => entrar("admin")}
                className="rounded-xl border border-primary-600/60 px-3 py-2 text-sm font-semibold transition-colors hover:bg-primary-600"
              >
                Administrador
              </button>
              <button
                type="button"
                onClick={() => entrar("boleteria")}
                className="rounded-xl border border-primary-600/60 px-3 py-2 text-sm font-semibold transition-colors hover:bg-primary-600"
              >
                Boletería
              </button>
            </div>
            <p className="mt-3 text-xs text-primary-100/50">
              Esta pantalla es una maqueta: no valida cuentas y todos los datos del panel son de ejemplo.
            </p>
          </div>
        </div>

        <Link to="/" className="mt-6 block text-center text-sm text-primary-100/60 transition-colors hover:text-white">
          <i className="bi bi-arrow-left" aria-hidden="true" /> Volver al sitio
        </Link>
      </div>
    </main>
  );
};

export default AdminLogin;
