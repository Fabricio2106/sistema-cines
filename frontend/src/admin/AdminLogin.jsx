import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import letras from "../assets/cinerama-letras.png";
import { useAdmin } from "./AdminContext";

const campo =
  "w-full rounded-xl border border-primary-800/70 bg-primary-950/70 py-3 pl-11 pr-4 text-white placeholder-surface-500 transition-colors focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400";

const AdminLogin = () => {
  const { cargando, rol, ingresar } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (cargando) return null;
  if (rol) return <Navigate to={rol === "admin" ? "/admin" : "/admin/ventas"} replace />;

  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const nuevo = await ingresar({ email, password });
      navigate(nuevo === "admin" ? "/admin" : "/admin/ventas", { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
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

          <form onSubmit={entrar} className="flex flex-col gap-4">
            <label className="block">
              <span className="text-sm font-medium text-primary-100/60">Correo del personal</span>
              <div className="relative mt-1.5">
                <i className="bi bi-envelope-fill pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@cinerama.com.pe"
                  autoComplete="username"
                  required
                  className={campo}
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-primary-100/60">Contraseña</span>
              <div className="relative mt-1.5">
                <i className="bi bi-lock-fill pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" aria-hidden="true" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={campo}
                />
              </div>
            </label>
            {error && (
              <p role="alert" className="rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-full bg-accent-400 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 disabled:translate-y-0 disabled:opacity-50"
            >
              {enviando ? "Ingresando…" : "Ingresar al panel"}
            </button>
          </form>
        </div>

        <Link to="/" className="mt-6 block text-center text-sm text-primary-100/60 transition-colors hover:text-white">
          <i className="bi bi-arrow-left" aria-hidden="true" /> Volver al sitio
        </Link>
      </div>
    </main>
  );
};

export default AdminLogin;
