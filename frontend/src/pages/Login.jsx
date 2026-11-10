import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const campo =
  "w-full px-4 py-3 rounded-lg bg-surface-800 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-400";

const Login = () => {
  const { usuario, ingresar, registrar } = useAuth();
  const { state } = useLocation();
  const from = state?.from;

  const [modo, setModo] = useState("ingresar");
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const esRegistro = modo === "registrar";

  if (usuario) {
    const destino = from ? `${from.pathname}${from.search}${from.hash}` : "/";
    return <Navigate to={destino} replace state={from?.state} />;
  }

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setError("");
    setAviso("");
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setEnviando(true);
    try {
      if (esRegistro) {
        const conSesion = await registrar(form);
        if (!conSesion) {
          setAviso("Te enviamos un correo para confirmar tu cuenta. Confírmalo y luego ingresa.");
          setModo("ingresar");
        }
      } else {
        await ingresar(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 text-white">
      <div className="w-full max-w-md bg-surface-900 border border-primary-700/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-2 gap-1 bg-surface-800 rounded-full p-1 mb-6" role="tablist">
          {[
            ["ingresar", "Ingresar"],
            ["registrar", "Crear cuenta"],
          ].map(([clave, texto]) => (
            <button
              key={clave}
              type="button"
              role="tab"
              aria-selected={modo === clave}
              onClick={() => cambiarModo(clave)}
              className={`py-2 rounded-full text-sm font-bold transition-colors ${
                modo === clave ? "bg-accent-500 text-black" : "text-surface-300 hover:text-white"
              }`}
            >
              {texto}
            </button>
          ))}
        </div>

        {from && (
          <p className="text-sm text-surface-300 mb-4 text-center">
            Inicia sesión para continuar con tu compra.
          </p>
        )}

        <form onSubmit={enviar} className="flex flex-col gap-4">
          {esRegistro && (
            <label className="block">
              <span className="text-sm text-surface-300">Nombre</span>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={cambiar}
                required
                autoComplete="name"
                placeholder="Tu nombre"
                className={`${campo} mt-1`}
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm text-surface-300">Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={cambiar}
              required
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              className={`${campo} mt-1`}
            />
          </label>

          <label className="block">
            <span className="text-sm text-surface-300">Contraseña</span>
            <div className="relative mt-1">
              <input
                type={verClave ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={cambiar}
                required
                autoComplete={esRegistro ? "new-password" : "current-password"}
                placeholder="Mínimo 6 caracteres"
                className={`${campo} pr-12`}
              />
              <button
                type="button"
                onClick={() => setVerClave((v) => !v)}
                aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-0 px-4 text-surface-400 hover:text-white"
              >
                <i className={`bi ${verClave ? "bi-eye-slash" : "bi-eye"}`} />
              </button>
            </div>
          </label>

          {aviso && (
            <p role="status" className="text-sm text-accent-200 bg-accent-950/60 border border-accent-800 rounded-lg px-3 py-2">
              {aviso}
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-300 bg-red-950/60 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 rounded-full font-bold bg-accent-500 hover:bg-accent-600 text-black disabled:opacity-50 transition-colors"
          >
            {enviando ? "Un momento…" : esRegistro ? "Crear cuenta" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
