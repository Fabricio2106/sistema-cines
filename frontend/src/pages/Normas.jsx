import { Link } from "react-router-dom";

const NORMAS = [
  "Antes de retirarse de la ventanilla, sírvase verificar su ticket de entrada (horario de función, película, sala y monto que pagó por él). La empresa no efectuará cambios ni devoluciones posteriores. Prohibido el ingreso con animales domésticos.",
  "Todo niño a partir de tres (03) años paga.",
  "La empresa se reserva el derecho de cambiar los horarios de las películas sin previo aviso.",
  "La empresa no se responsabiliza por la pérdida de sus pertenencias.",
  "Todo billete falso será marcado.",
  "La empresa Cinerama Pacífico cuenta con libro de reclamaciones.",
];

const Normas = () => (
  <main className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:px-12">
    <header className="mb-12 text-center">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Normas del cine</h1>
      <div className="mx-auto mt-3 h-1 w-24 bg-accent-400" />
      <p className="mt-4 text-surface-400">Para garantizar una mejor experiencia a todos nuestros clientes</p>
    </header>

    <ol className="grid gap-x-6 gap-y-8 md:grid-cols-2">
      {NORMAS.map((texto, i) => (
        <li
          key={texto}
          className="group relative rounded-xl border border-surface-700 bg-gradient-to-br from-surface-900 to-surface-800 p-6 transition-colors duration-300 hover:border-primary-600/50"
        >
          <span
            className="absolute -left-3 -top-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-xl font-bold text-white shadow-lg shadow-primary-900/50 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="ml-8 mt-2 leading-relaxed text-surface-300">{texto}</p>
        </li>
      ))}
    </ol>

    <div className="mt-12 rounded-r-xl border-l-4 border-accent-400 bg-accent-900/20 p-6">
      <p className="font-semibold text-accent-400">
        El incumplimiento de estas normas puede resultar en la expulsión del establecimiento sin derecho a reembolso.
      </p>
    </div>

    <p className="mt-8 text-sm text-surface-400">
      Si tienes un reclamo, regístralo en el{" "}
      <Link to="/libro-de-reclamaciones" className="text-accent-400 hover:underline">
        Libro de Reclamaciones
      </Link>
      .
    </p>
  </main>
);

export default Normas;
