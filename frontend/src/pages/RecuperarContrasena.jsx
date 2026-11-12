import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PanelAuth from "../components/PanelAuth/PanelAuth";
import { useAuth } from "../context/AuthContext";

const campo =
  "w-full rounded-xl border border-primary-800/70 bg-primary-950/70 py-3 pl-11 pr-4 text-white placeholder-surface-500 transition-colors focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400";

const RecuperarContrasena = () => {
  const { enviarCorreoRecuperacion } = useAuth();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email ?? "");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await enviarCorreoRecuperacion(email);
      setEnviado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <PanelAuth
        titulo="Revisa tu correo"
        subtitulo={`Si ${email} tiene una cuenta, te enviamos un enlace para elegir una contraseña nueva. Si no lo ves, revisa la carpeta de spam.`}
      >
        <Link
          to="/login"
          className="flex w-full items-center justify-center rounded-full bg-accent-400 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300"
        >
          Volver a ingresar
        </Link>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-4 w-full text-center text-sm text-primary-100/60 hover:text-white"
        >
          Usar otro correo
        </button>
      </PanelAuth>
    );
  }

  return (
    <PanelAuth
      titulo="¿Olvidaste tu contraseña?"
      subtitulo="Escribe el correo con el que creaste tu cuenta y te enviaremos un enlace para cambiarla."
    >
      <form onSubmit={enviar} className="flex flex-col gap-5">
        <label className="block">
          <span className="text-sm font-medium text-primary-100/80">Correo electrónico</span>
          <div className="relative mt-1.5">
            <i
              className="bi bi-envelope-fill pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
              aria-hidden="true"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              className={campo}
            />
          </div>
        </label>

        {error && (
          <p role="alert" className="rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-full bg-accent-400 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Cambiar contraseña"}
        </button>
      </form>
    </PanelAuth>
  );
};

export default RecuperarContrasena;
