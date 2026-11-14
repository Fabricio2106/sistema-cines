import { Link } from "react-router-dom";
import EncabezadoPagina from "../components/EncabezadoPagina/EncabezadoPagina";

const NORMAS = [
  "Antes de retirarse de la ventanilla, sírvase verificar su ticket de entrada (horario de función, película, sala y monto que pagó por él). La empresa no efectuará cambios ni devoluciones posteriores. Prohibido el ingreso con animales domésticos.",
  "Todo niño a partir de tres (03) años paga.",
  "La empresa se reserva el derecho de cambiar los horarios de las películas sin previo aviso.",
  "La empresa no se responsabiliza por la pérdida de sus pertenencias.",
  "Todo billete falso será marcado.",
  "La empresa Cinerama Pacífico cuenta con libro de reclamaciones.",
];

const Normas = () => (
  <main className="mx-auto max-w-5xl px-6 pb-20 pt-32 sm:px-12">
    <EncabezadoPagina
      icono="bi-card-checklist"
      titulo="Normas del cine"
      descripcion="Para garantizar una mejor experiencia a todos nuestros clientes"
    />

    <ol className="grid gap-x-6 gap-y-8 md:grid-cols-2">
      {NORMAS.map((texto, i) => (
        <li
          key={texto}
          className="group relative rounded-2xl border border-primary-700/40 bg-primary-900/30 p-6 pl-9 transition-colors duration-300 hover:border-primary-500/60"
        >
          <span
            className="absolute -left-3 -top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white shadow-lg shadow-primary-900/60 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-1 leading-relaxed text-primary-100/80">{texto}</p>
        </li>
      ))}
    </ol>

    <div className="mt-12 flex items-start gap-4 rounded-2xl border border-accent-400/30 bg-accent-400/10 p-6">
      <i className="bi bi-exclamation-triangle-fill mt-0.5 text-xl text-accent-400" aria-hidden="true" />
      <p className="font-semibold text-accent-300">
        El incumplimiento de estas normas puede resultar en la expulsión del establecimiento sin derecho a reembolso.
      </p>
    </div>

    <p className="mt-8 text-sm text-primary-100/60">
      Si tienes un reclamo, regístralo en el{" "}
      <Link to="/libro-de-reclamaciones" className="font-semibold text-accent-400 hover:underline">
        Libro de Reclamaciones
      </Link>
      .
    </p>
  </main>
);

export default Normas;
