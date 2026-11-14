import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrarReclamo } from "../services/reclamos";
import { CINE } from "../data/cine";
import { esquemaReclamo } from "../utils/esquemas";

const campoBase =
  "w-full px-4 py-3 rounded-lg bg-surface-800 border text-white placeholder-surface-500 focus:outline-none focus:ring-1";

const vacio = {
  tipo: "reclamo",
  nombre: "",
  tipoDocumento: "DNI",
  numeroDocumento: "",
  correo: "",
  telefono: "",
  direccion: "",
  detalle: "",
  pedido: "",
  acepta: false,
};

const Etiqueta = ({ htmlFor, children, opcional }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-surface-200">
    {children}
    {opcional && <span className="ml-1 text-surface-500">(opcional)</span>}
  </label>
);

const Mensaje = ({ children }) =>
  children ? (
    <p role="alert" className="mt-1 text-xs text-red-300">
      {children}
    </p>
  ) : null;

const LibroReclamaciones = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaReclamo), defaultValues: vacio, mode: "onTouched" });
  const [error, setError] = useState("");
  const [numero, setNumero] = useState(null);

  const tipo = watch("tipo");
  const campo = (nombre) =>
    `${campoBase} ${errors[nombre] ? "border-red-500/70 focus:border-red-400 focus:ring-red-400" : "border-surface-700 focus:border-accent-400 focus:ring-accent-400"}`;

  const enviar = handleSubmit(async (datos) => {
    setError("");
    try {
      setNumero(await registrarReclamo(datos));
      reset(vacio);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    }
  });

  if (numero !== null) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-20 pt-32 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl text-green-400">
          <i className="bi bi-check-lg" aria-hidden="true" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">Registramos tu hoja de reclamación</h1>
        <p className="text-surface-300">
          Número de registro: <strong className="text-accent-400">N.º {String(numero).padStart(6, "0")}</strong>
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-surface-400">
          Guarda este número. Te responderemos al correo que indicaste dentro del plazo que establece la ley.
        </p>
        <Link to="/" className="mt-8 inline-block rounded-full bg-accent-500 px-7 py-3 font-bold text-black hover:bg-accent-400">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-20 pt-28">
      <h1 className="mb-2 border-b-2 border-accent-400 pb-3 text-3xl font-bold text-white sm:text-4xl">
        Libro de Reclamaciones
      </h1>
      <p className="mt-3 text-surface-300">
        Registra aquí tu reclamo o queja sobre {CINE.nombre}. Los campos marcados con * son obligatorios.
      </p>
      <dl className="mb-8 mt-5 grid gap-x-6 gap-y-1 rounded-xl border border-surface-700 bg-surface-900/60 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="inline text-surface-500">Razón social: </dt>
          <dd className="inline text-surface-200">{CINE.razonSocial}</dd>
        </div>
        <div>
          <dt className="inline text-surface-500">RUC: </dt>
          <dd className="inline text-surface-200">{CINE.ruc}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="inline text-surface-500">Establecimiento: </dt>
          <dd className="inline text-surface-200">
            {CINE.nombre}, {CINE.direccion}, {CINE.ciudad}
          </dd>
        </div>
      </dl>

      <form onSubmit={enviar} noValidate className="space-y-6">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-surface-200">Tipo *</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["reclamo", "Reclamo", "Disconformidad con el servicio o la compra"],
              ["queja", "Queja", "Malestar por la atención, sin relación con la compra"],
            ].map(([valor, titulo, ayuda]) => (
              <label
                key={valor}
                className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                  tipo === valor ? "border-accent-500 bg-accent-500/10" : "border-surface-700 hover:border-surface-500"
                }`}
              >
                <input type="radio" value={valor} className="sr-only" {...register("tipo")} />
                <span className="block font-semibold text-white">{titulo}</span>
                <span className="text-sm text-surface-400">{ayuda}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <Etiqueta htmlFor="nombre">Nombres y apellidos *</Etiqueta>
          <input id="nombre" autoComplete="name" aria-invalid={Boolean(errors.nombre)} className={campo("nombre")} {...register("nombre")} />
          <Mensaje>{errors.nombre?.message}</Mensaje>
        </div>

        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <div>
            <Etiqueta htmlFor="tipoDocumento">Documento *</Etiqueta>
            <select id="tipoDocumento" className={campo("tipoDocumento")} {...register("tipoDocumento")}>
              <option>DNI</option>
              <option value="CE">Carné de extranjería</option>
              <option>Pasaporte</option>
              <option>RUC</option>
            </select>
          </div>
          <div>
            <Etiqueta htmlFor="numeroDocumento">Número de documento *</Etiqueta>
            <input
              id="numeroDocumento"
              inputMode="numeric"
              aria-invalid={Boolean(errors.numeroDocumento)}
              className={campo("numeroDocumento")}
              {...register("numeroDocumento")}
            />
            <Mensaje>{errors.numeroDocumento?.message}</Mensaje>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Etiqueta htmlFor="correo">Correo electrónico *</Etiqueta>
            <input
              id="correo"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.correo)}
              className={campo("correo")}
              {...register("correo")}
            />
            <Mensaje>{errors.correo?.message}</Mensaje>
          </div>
          <div>
            <Etiqueta htmlFor="telefono" opcional>Teléfono</Etiqueta>
            <input id="telefono" type="tel" autoComplete="tel" className={campo("telefono")} {...register("telefono")} />
            <Mensaje>{errors.telefono?.message}</Mensaje>
          </div>
        </div>

        <div>
          <Etiqueta htmlFor="direccion" opcional>Dirección</Etiqueta>
          <input id="direccion" autoComplete="street-address" className={campo("direccion")} {...register("direccion")} />
          <Mensaje>{errors.direccion?.message}</Mensaje>
        </div>

        <div>
          <Etiqueta htmlFor="detalle">Detalle de lo ocurrido *</Etiqueta>
          <textarea id="detalle" rows={5} aria-invalid={Boolean(errors.detalle)} className={campo("detalle")} {...register("detalle")} />
          <Mensaje>{errors.detalle?.message}</Mensaje>
        </div>

        <div>
          <Etiqueta htmlFor="pedido">¿Qué solución esperas? *</Etiqueta>
          <textarea id="pedido" rows={3} aria-invalid={Boolean(errors.pedido)} className={campo("pedido")} {...register("pedido")} />
          <Mensaje>{errors.pedido?.message}</Mensaje>
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-surface-300">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-yellow-400" {...register("acepta")} />
            <span>
              Acepto el tratamiento de mis datos para atender este reclamo, según la{" "}
              <Link to="/legal/politica-de-datos-personales" className="text-accent-400 hover:underline">
                Política de Protección de Datos Personales
              </Link>
              . *
            </span>
          </label>
          <Mensaje>{errors.acepta?.message}</Mensaje>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-accent-500 px-6 py-3 font-bold text-black transition-colors hover:bg-accent-400 disabled:opacity-60"
        >
          {isSubmitting ? "Enviando…" : "Enviar hoja de reclamación"}
        </button>
      </form>
    </main>
  );
};

export default LibroReclamaciones;
