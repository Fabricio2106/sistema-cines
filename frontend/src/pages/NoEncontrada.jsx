import { Link } from "react-router-dom";

const NoEncontrada = () => (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-center text-white">
    <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" aria-hidden="true" />
    <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-primary-700/20 blur-3xl" aria-hidden="true" />

    <div className="relative max-w-lg">
      <p
        className="bg-gradient-to-b from-primary-400 to-primary-800 bg-clip-text text-8xl font-black leading-none text-transparent sm:text-9xl"
        aria-hidden="true"
      >
        404
      </p>
      <i className="bi bi-film mt-2 block text-4xl text-accent-400" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Esta función no existe</h1>
      <p className="mt-3 text-primary-100/60">
        La página que buscas no está en cartelera. Puede que el enlace esté mal escrito o que ya no exista.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-400 px-6 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300"
        >
          <i className="bi bi-house-door-fill" aria-hidden="true" />
          Volver al inicio
        </Link>
        <Link
          to="/#estrenos"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-600 px-6 py-3 font-semibold transition-colors hover:bg-primary-600"
        >
          <i className="bi bi-ticket-perforated-fill" aria-hidden="true" />
          Ver la cartelera
        </Link>
      </div>
    </div>
  </main>
);

export default NoEncontrada;
