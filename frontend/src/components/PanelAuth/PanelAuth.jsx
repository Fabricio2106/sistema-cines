import { Link } from "react-router-dom";
import letras from "../../assets/cinerama-letras.png";
import { CINE } from "../../data/cine";

// Pantalla completa dividida en dos: banner de marca (solo escritorio) y el contenido a la derecha.
const PanelAuth = ({ titulo, subtitulo, children }) => (
  <main className="min-h-screen text-white lg:h-screen lg:overflow-hidden">
    <div className="grid grid-cols-1 min-h-screen lg:h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-primary-900 lg:block">
          <img src="/login-fondo.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative flex h-full flex-col items-center justify-evenly px-12 py-28 text-center">
            <Link to="/" aria-label={`${CINE.nombre}, ir al inicio`}>
              <img src={letras} alt={CINE.nombre} className="w-80 drop-shadow-2xl" />
            </Link>
            <div>
              <h2 className="text-4xl font-bold leading-tight">Vive el cine a lo grande</h2>
              <p className="mx-auto mt-3 max-w-sm text-primary-100/80">Tus entradas y tus compras, en un solo lugar.</p>
            </div>
          </div>
        </aside>

      <section className="relative flex flex-col justify-center bg-primary-950 px-6 py-10 sm:px-16 lg:overflow-y-auto xl:px-24">
        <Link
          to="/login"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-primary-100/60 transition-colors hover:text-white sm:left-16 xl:left-24"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Volver a ingresar
        </Link>
        <div className="mx-auto w-full max-w-md pt-8">
          <Link to="/" aria-label={`${CINE.nombre}, ir al inicio`} className="mb-6 block w-fit lg:hidden">
            <img src={letras} alt={CINE.nombre} className="w-48 sm:w-56" />
          </Link>
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/25 text-2xl text-accent-400">
            <i className="bi bi-shield-lock-fill" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold sm:text-3xl">{titulo}</h1>
          <p className="mb-6 mt-2 text-sm leading-relaxed text-primary-100/60">{subtitulo}</p>
          {children}
        </div>
      </section>
    </div>
  </main>
);

export default PanelAuth;
