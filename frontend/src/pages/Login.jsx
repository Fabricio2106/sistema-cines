import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import Selector from "../components/Selector/Selector";
import letras from "../assets/cinerama-letras.png";
import { CINE } from "../data/cine";
import { GENEROS, hoy, soloDigitos } from "../utils/datosPersonales";
import { esquemaIngreso, esquemaRegistro } from "../utils/esquemas";

const campoBase =
  "w-full rounded-xl border bg-primary-950/70 py-3 pl-11 pr-4 text-white placeholder-surface-500 transition-colors focus:outline-none focus:ring-1";
const bordeNormal = "border-primary-800/70 focus:border-accent-400 focus:ring-accent-400";
const bordeError = "border-red-500/70 focus:border-red-400 focus:ring-red-400";

const BENEFICIOS = [
  ["bi-ticket-perforated-fill", "Compra tus entradas en segundos"],
  ["bi-grid-3x3-gap-fill", "Elige tus butacas favoritas"],
  ["bi-clock-history", "Revisa tu historial de compras"],
];

const VALORES_INICIALES = {
  nombre: "",
  apellidos: "",
  dni: "",
  fechaNacimiento: "",
  genero: "",
  celular: "",
  email: "",
  password: "",
  aceptaTerminos: false,
  promociones: false,
};

const Mensaje = ({ children }) =>
  children ? (
    <span role="alert" className="mt-1 block text-xs text-red-300">
      {children}
    </span>
  ) : null;

const Campo = ({ icono, etiqueta, error, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-primary-100/60">{etiqueta}</span>
    <div className="relative mt-1.5">
      <i
        className={`bi ${icono} pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400`}
        aria-hidden="true"
      />
      {children}
    </div>
    <Mensaje>{error}</Mensaje>
  </label>
);

const Casilla = ({ error, children, ...props }) => (
  <div>
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-primary-100/70">
      <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-yellow-400" {...props} />
      <span>{children}</span>
    </label>
    <Mensaje>{error}</Mensaje>
  </div>
);

const enlace = "font-semibold text-accent-400 hover:underline";

const Login = () => {
  const { usuario, ingresar, registrar } = useAuth();
  const { state } = useLocation();
  const from = state?.from;

  const [modo, setModo] = useState("ingresar");
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const esRegistro = modo === "registrar";

  // El esquema cambia según el modo; el resolver se vuelve a leer en cada envío.
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: VALORES_INICIALES,
    mode: "onTouched",
    resolver: (valores, contexto, opciones) =>
      zodResolver(esRegistro ? esquemaRegistro : esquemaIngreso)(valores, contexto, opciones),
  });

  // En el registro los campos son más bajos para que todo entre en la pantalla sin scroll
  const clase = (nombre) =>
    `${esRegistro ? campoBase.replace("py-3", "py-2") : campoBase} ${errors[nombre] ? bordeError : bordeNormal}`;

  // Campo numérico: solo deja escribir dígitos y corta al máximo
  const soloNumeros = (nombre, max) => {
    const { onChange, ...resto } = register(nombre);
    return {
      ...resto,
      onChange: (e) => {
        e.target.value = soloDigitos(e.target.value, max);
        return onChange(e);
      },
    };
  };

  if (usuario) {
    const destino = from ? `${from.pathname}${from.search}${from.hash}` : "/";
    return <Navigate to={destino} replace state={from?.state} />;
  }

  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    clearErrors();
    setError("");
    setAviso("");
  };

  const enviar = handleSubmit(async (datos) => {
    setError("");
    setEnviando(true);
    try {
      if (esRegistro) {
        const conSesion = await registrar(datos);
        if (!conSesion) {
          setAviso("Te enviamos un correo para confirmar tu cuenta. Confírmalo y luego ingresa.");
          setModo("ingresar");
        }
      } else {
        await ingresar(datos);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  });

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

            <form
              onSubmit={enviar}
              noValidate
              className={esRegistro ? "grid gap-x-4 gap-y-3 sm:grid-cols-2" : "flex flex-col gap-5"}
            >
              {esRegistro && (
                <div className="contents">
                  <Campo icono="bi-person-fill" etiqueta="Nombre" error={errors.nombre?.message}>
                    <input
                      type="text"
                      autoComplete="given-name"
                      placeholder="Tu nombre"
                      aria-invalid={Boolean(errors.nombre)}
                      className={clase("nombre")}
                      {...register("nombre")}
                    />
                  </Campo>
                  <Campo icono="bi-person-fill" etiqueta="Apellidos" error={errors.apellidos?.message}>
                    <input
                      type="text"
                      autoComplete="family-name"
                      placeholder="Tus apellidos"
                      aria-invalid={Boolean(errors.apellidos)}
                      className={clase("apellidos")}
                      {...register("apellidos")}
                    />
                  </Campo>
                  <Campo icono="bi-person-vcard-fill" etiqueta="DNI" error={errors.dni?.message}>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="8 dígitos"
                      aria-invalid={Boolean(errors.dni)}
                      className={clase("dni")}
                      {...soloNumeros("dni", 8)}
                    />
                  </Campo>
                  <Campo icono="bi-phone-fill" etiqueta="Número de celular" error={errors.celular?.message}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="9XX XXX XXX"
                      aria-invalid={Boolean(errors.celular)}
                      className={clase("celular")}
                      {...soloNumeros("celular", 9)}
                    />
                  </Campo>
                  <Campo icono="bi-calendar-event-fill" etiqueta="Fecha de nacimiento" error={errors.fechaNacimiento?.message}>
                    <input
                      type="date"
                      min="1900-01-01"
                      max={hoy()}
                      autoComplete="bday"
                      aria-invalid={Boolean(errors.fechaNacimiento)}
                      className={`${clase("fechaNacimiento")} [color-scheme:dark]`}
                      {...register("fechaNacimiento")}
                    />
                  </Campo>
                  <Campo icono="bi-gender-ambiguous" etiqueta="Género" error={errors.genero?.message}>
                    <Controller
                      name="genero"
                      control={control}
                      render={({ field }) => (
                        <Selector
                          name="genero"
                          value={field.value}
                          onChange={field.onChange}
                          opciones={GENEROS}
                          className={clase("genero")}
                        />
                      )}
                    />
                  </Campo>
                </div>
              )}

              <Campo icono="bi-envelope-fill" etiqueta="Correo electrónico" error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  aria-invalid={Boolean(errors.email)}
                  className={clase("email")}
                  {...register("email")}
                />
              </Campo>

              <Campo icono="bi-lock-fill" etiqueta="Contraseña" error={errors.password?.message}>
                <input
                  type={verClave ? "text" : "password"}
                  autoComplete={esRegistro ? "new-password" : "current-password"}
                  placeholder="Mínimo 6 caracteres"
                  aria-invalid={Boolean(errors.password)}
                  className={`${clase("password")} pr-12`}
                  {...register("password")}
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
                  <Link to="/recuperar-contrasena" state={{ email: watch("email") }} className={`text-sm ${enlace}`}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}

              {esRegistro && (
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Casilla error={errors.aceptaTerminos?.message} {...register("aceptaTerminos")}>
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
                  <Casilla {...register("promociones")}>
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
