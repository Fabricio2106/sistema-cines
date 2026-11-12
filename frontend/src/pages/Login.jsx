import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Selector from "../components/Selector/Selector";
import letras from "../assets/cinerama-letras.png";
import { CINE } from "../data/cine";
import { GENEROS, hoy, soloDigitos, validarDatosPersonales } from "../utils/datosPersonales";

const campoBase =
  "w-full rounded-xl border border-primary-800/70 bg-primary-950/70 py-3 pl-11 pr-4 text-white placeholder-surface-500 transition-colors focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400";

const BENEFICIOS = [
  ["bi-ticket-perforated-fill", "Compra tus entradas en segundos"],
  ["bi-grid-3x3-gap-fill", "Elige tus butacas favoritas"],
  ["bi-clock-history", "Revisa tu historial de compras"],
];

const FORM_INICIAL = {
  nombre: "",
  apellidos: "",
  dni: "",
  fechaNacimiento: "",
  genero: "",
  celular: "",
  email: "",
  password: "",
};

const Campo = ({ icono, etiqueta, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-primary-100/60">{etiqueta}</span>
    <div className="relative mt-1.5">
      <i
        className={`bi ${icono} pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400`}
        aria-hidden="true"
      />
      {children}
    </div>
  </label>
);

const Casilla = ({ checked, onChange, required, children }) => (
  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-primary-100/70">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      required={required}
      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-yellow-400"
    />
    <span>{children}</span>
  </label>
);

const enlace = "font-semibold text-accent-400 hover:underline";

const Login = () => {
  const { usuario, ingresar, registrar } = useAuth();
  const { state } = useLocation();
  const from = state?.from;

  const [modo, setModo] = useState("ingresar");
  const [form, setForm] = useState(FORM_INICIAL);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPromociones, setAceptaPromociones] = useState(false);
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const esRegistro = modo === "registrar";
  // En el registro los campos son más bajos para que todo entre en la pantalla sin scroll
  const campo = esRegistro ? campoBase.replace("py-3", "py-2") : campoBase;

  if (usuario) {
    const destino = from ? `${from.pathname}${from.search}${from.hash}` : "/";
    return <Navigate to={destino} replace state={from?.state} />;
  }

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cambiarDigitos = (max) => (e) => setForm({ ...form, [e.target.name]: soloDigitos(e.target.value, max) });

  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setError("");
    setAviso("");
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError("");

    if (esRegistro) {
      const problema = validarDatosPersonales(form);
      if (problema) return setError(problema);
      if (!aceptaTerminos) {
        return setError("Debes aceptar los Términos y Condiciones y la Política de Protección de Datos Personales");
      }
    }
    if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");

    setEnviando(true);
    try {
      if (esRegistro) {
        const conSesion = await registrar({ ...form, promociones: aceptaPromociones });
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
    <main className="min-h-screen text-white lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-2">
        {/* Panel de marca (solo escritorio) */}
        <aside className="relative hidden overflow-hidden bg-primary-900 lg:block">
          <img src="/login-fondo.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative flex h-full flex-col items-center justify-evenly px-12 py-28 text-center">
            <Link to="/" aria-label={`${CINE.nombre}, ir al inicio`}>
              <img src={letras} alt={CINE.nombre} className="w-80 drop-shadow-2xl" />
            </Link>
            <div>
              <h2 className="text-4xl font-bold leading-tight">Vive el cine a lo grande</h2>
              <p className="mx-auto mt-3 max-w-sm text-primary-100/80">Crea tu cuenta o ingresa para comprar tus entradas.</p>
            </div>
            <ul className="w-full max-w-sm space-y-4 text-left text-sm">
              {BENEFICIOS.map(([icono, texto]) => (
                <li
                  key={texto}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-400 text-lg text-black">
                    <i className={`bi ${icono}`} aria-hidden="true" />
                  </span>
                  {texto}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Formulario */}
        <section className="relative flex flex-col justify-center bg-primary-950 px-6 py-10 sm:px-16 lg:overflow-y-auto lg:py-6 xl:px-20">
          <Link
            to="/"
            className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-primary-100/60 transition-colors hover:text-white sm:left-16 xl:left-24"
          >
            <i className="bi bi-arrow-left" aria-hidden="true" />
            Volver al inicio
          </Link>

          <div className={`mx-auto w-full ${esRegistro ? "max-w-2xl lg:pt-6" : "max-w-md"}`}>
            <Link to="/" aria-label={`${CINE.nombre}, ir al inicio`} className={`block w-fit lg:hidden ${esRegistro ? "mb-3" : "mb-5"}`}>
              <img src={letras} alt={CINE.nombre} className={esRegistro ? "w-36 sm:w-40" : "w-48 sm:w-56"} />
            </Link>
            <h1 className="text-2xl font-bold sm:text-3xl">{esRegistro ? "Crea tu cuenta" : "Bienvenido de nuevo"}</h1>
            <p className="mb-4 mt-1 text-sm text-primary-100/60">
              {from
                ? "Inicia sesión para continuar con tu compra."
                : esRegistro
                  ? "Completa tus datos para comprar entradas y ver tus compras."
                  : "Ingresa con tu correo y contraseña."}
            </p>

            <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-primary-900/70 p-1" role="tablist">
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
                  className={`rounded-full py-2 text-sm font-bold transition-colors ${
                    modo === clave
                      ? "bg-primary-600 text-white shadow-md shadow-primary-900/60"
                      : "text-primary-100/60 hover:text-white"
                  }`}
                >
                  {texto}
                </button>
              ))}
            </div>

            <form onSubmit={enviar} className={esRegistro ? "grid gap-x-4 gap-y-3 sm:grid-cols-2" : "flex flex-col gap-5"}>
              {esRegistro && (
                <>
                  <div className="contents">
                    <Campo icono="bi-person-fill" etiqueta="Nombre">
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={cambiar}
                        required
                        autoComplete="given-name"
                        placeholder="Tu nombre"
                        className={campo}
                      />
                    </Campo>
                    <Campo icono="bi-person-fill" etiqueta="Apellidos">
                      <input
                        type="text"
                        name="apellidos"
                        value={form.apellidos}
                        onChange={cambiar}
                        required
                        autoComplete="family-name"
                        placeholder="Tus apellidos"
                        className={campo}
                      />
                    </Campo>
                    <Campo icono="bi-person-vcard-fill" etiqueta="DNI">
                      <input
                        type="text"
                        name="dni"
                        value={form.dni}
                        onChange={cambiarDigitos(8)}
                        required
                        inputMode="numeric"
                        pattern="\d{8}"
                        title="8 dígitos"
                        placeholder="8 dígitos"
                        className={campo}
                      />
                    </Campo>
                    <Campo icono="bi-phone-fill" etiqueta="Número de celular">
                      <input
                        type="tel"
                        name="celular"
                        value={form.celular}
                        onChange={cambiarDigitos(9)}
                        required
                        inputMode="numeric"
                        autoComplete="tel-national"
                        pattern="9\d{8}"
                        title="9 dígitos, empieza con 9"
                        placeholder="9XX XXX XXX"
                        className={campo}
                      />
                    </Campo>
                    <Campo icono="bi-calendar-event-fill" etiqueta="Fecha de nacimiento">
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        onChange={cambiar}
                        required
                        min="1900-01-01"
                        max={hoy()}
                        autoComplete="bday"
                        className={`${campo} [color-scheme:dark]`}
                      />
                    </Campo>
                    <Campo icono="bi-gender-ambiguous" etiqueta="Género">
                      <Selector
                        name="genero"
                        value={form.genero}
                        onChange={cambiar}
                        opciones={GENEROS}
                        className={campo}
                      />
                    </Campo>
                  </div>
                </>
              )}

              <Campo icono="bi-envelope-fill" etiqueta="Correo electrónico">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={cambiar}
                  required
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  className={campo}
                />
              </Campo>

              <Campo icono="bi-lock-fill" etiqueta="Contraseña">
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
              </Campo>

              {!esRegistro && (
                <div className="-mt-3 text-right">
                  <Link to="/recuperar-contrasena" state={{ email: form.email }} className={`text-sm ${enlace}`}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}

              {esRegistro && (
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Casilla checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} required>
                    He leído y acepto los{" "}
                    <Link to="/legal/terminos-y-condiciones" target="_blank" className={enlace}>
                      Términos y Condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link to="/legal/politica-de-datos-personales" target="_blank" className={enlace}>
                      Política de Protección de Datos Personales
                    </Link>
                    .
                  </Casilla>
                  <Casilla checked={aceptaPromociones} onChange={(e) => setAceptaPromociones(e.target.checked)}>
                    Acepto recibir promociones e información de {CINE.nombre} y entiendo que algunos beneficios solo
                    podrán ser asignados mediante el envío de correo electrónico.
                  </Casilla>
                </div>
              )}

              {aviso && (
                <p role="status" className="sm:col-span-2 rounded-lg border border-accent-800 bg-accent-950/60 px-3 py-2 text-sm text-accent-200">
                  {aviso}
                </p>
              )}

              {error && (
                <p role="alert" className="sm:col-span-2 rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-full bg-accent-400 py-3 font-bold sm:col-span-2 text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 disabled:opacity-50"
              >
                {enviando ? "Un momento…" : esRegistro ? "Crear cuenta" : "Entrar"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-primary-100/60">
              {esRegistro ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}{" "}
              <button
                type="button"
                onClick={() => cambiarModo(esRegistro ? "ingresar" : "registrar")}
                className={enlace}
              >
                {esRegistro ? "Ingresa" : "Regístrate"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
