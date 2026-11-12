import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PanelAuth from "../components/PanelAuth/PanelAuth";
import { useAuth } from "../context/AuthContext";

const campo =
  "w-full rounded-xl border border-primary-800/70 bg-primary-950/70 py-3 pl-11 pr-4 text-white placeholder-surface-500 transition-colors focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400";

const botonPrincipal =
  "flex w-full items-center justify-center rounded-full bg-accent-400 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 disabled:opacity-50";

// Se llega aquí desde el enlace del correo: Supabase abre una sesión temporal de recuperación.
const RestablecerContrasena = () => {
  const { usuario, cargando, cambiarPassword } = useAuth();
  const navigate = useNavigate();
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (cargando) return <PanelAuth titulo="Un momento…" subtitulo="Verificando tu enlace." />;

  if (!usuario) {
    return (
      <PanelAuth
        titulo="Enlace no válido"
        subtitulo="El enlace para cambiar tu contraseña venció o ya fue usado. Pide uno nuevo."
      >
        <Link to="/recuperar-contrasena" className={botonPrincipal}>
          Pedir un enlace nuevo
        </Link>
      </PanelAuth>
    );
  }

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (clave.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
    if (clave !== clave2) return setError("Las contraseñas no coinciden");
    setEnviando(true);
    try {
      await cambiarPassword(clave);
      navigate("/perfil?tab=datos", { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <PanelAuth titulo="Elige tu nueva contraseña" subtitulo="Escribe una contraseña nueva para tu cuenta.">
      <form onSubmit={enviar} className="flex flex-col gap-5">
        {[
          ["Nueva contraseña", clave, setClave],
          ["Repite la contraseña", clave2, setClave2],
        ].map(([etiqueta, valor, setValor]) => (
          <label key={etiqueta} className="block">
            <span className="text-sm font-medium text-primary-100/80">{etiqueta}</span>
            <div className="relative mt-1.5">
              <i
                className="bi bi-lock-fill pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                aria-hidden="true"
              />
              <input
                type="password"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                className={campo}
              />
            </div>
          </label>
        ))}

        {error && (
          <p role="alert" className="rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={enviando} className={botonPrincipal}>
          {enviando ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>
    </PanelAuth>
  );
};

export default RestablecerContrasena;
