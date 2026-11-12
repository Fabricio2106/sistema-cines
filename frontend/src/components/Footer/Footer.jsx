import { Link } from "react-router-dom";
import { CINE } from "../../data/cine";

const ENLACES_CINE = [
  ["Cartelera", "/#estrenos"],
  ["Cómo llegar", "/como-llegar"],
  ["Normas del cine", "/normas"],
  ["Reglas de convivencia", "/legal/reglas-de-convivencia"],
];

const ENLACES_LEGALES = [
  ["Política de Protección de Datos Personales", "/legal/politica-de-datos-personales"],
  ["Condiciones de uso y seguridad", "/legal/condiciones-de-uso-y-seguridad"],
  ["Términos y condiciones", "/legal/terminos-y-condiciones"],
];

const Titulo = ({ children }) => (
  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
    <span className="h-5 w-1 rounded bg-accent-400" aria-hidden="true" />
    {children}
  </h3>
);

const ListaEnlaces = ({ enlaces }) => (
  <ul className="space-y-2.5 text-sm">
    {enlaces.map(([texto, ruta]) => (
      <li key={ruta}>
        <Link to={ruta} className="transition-colors hover:text-accent-400">
          {texto}
        </Link>
      </li>
    ))}
  </ul>
);

const Footer = () => (
  <footer className="mt-20 border-t-2 border-accent-500/40 bg-gradient-to-b from-surface-900 to-black text-surface-400">
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.3fr]">
        {/* Marca y redes */}
        <div>
          <p className="text-xl font-bold text-white">{CINE.nombre}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Tu cine en Miraflores. Los mejores estrenos con la mejor calidad de imagen y sonido.
          </p>
          <ul className="mt-6 flex gap-3" aria-label="Redes sociales">
            {CINE.redes.map((red) => (
              <li key={red.nombre}>
                <a
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={red.nombre}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-700 bg-primary-900/50 text-primary-200 transition-all duration-300 hover:border-accent-400 hover:bg-accent-500 hover:text-black"
                >
                  <i className={`bi ${red.icono}`} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Información del cine */}
        <nav aria-label="Información del cine">
          <Titulo>Información</Titulo>
          <ListaEnlaces enlaces={ENLACES_CINE} />
        </nav>

        {/* Legal */}
        <nav aria-label="Información legal">
          <Titulo>Legal</Titulo>
          <ListaEnlaces enlaces={ENLACES_LEGALES} />
        </nav>

        {/* Contacto y Libro de Reclamaciones */}
        <div>
          <Titulo>Contacto</Titulo>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <i className="bi bi-geo-alt-fill mt-0.5 text-accent-400" aria-hidden="true" />
              <span>
                {CINE.direccion}
                <br />
                {CINE.ciudad}
              </span>
            </li>
            <li className="flex gap-3">
              <i className="bi bi-telephone-fill mt-0.5 text-accent-400" aria-hidden="true" />
              <a href={CINE.telefonoEnlace} className="transition-colors hover:text-accent-400">
                {CINE.telefono}
              </a>
            </li>
            <li className="flex gap-3">
              <i className="bi bi-phone-fill mt-0.5 text-accent-400" aria-hidden="true" />
              <a href={CINE.celularEnlace} className="transition-colors hover:text-accent-400">
                {CINE.celular}
              </a>
            </li>
            <li className="flex gap-3">
              <i className="bi bi-envelope-fill mt-0.5 text-accent-400" aria-hidden="true" />
              <a href={`mailto:${CINE.correo}`} className="break-all transition-colors hover:text-accent-400">
                {CINE.correo}
              </a>
            </li>
            <li className="flex gap-3">
              <i className="bi bi-clock-fill mt-0.5 text-accent-400" aria-hidden="true" />
              <span>{CINE.horario}</span>
            </li>
          </ul>

          <Link
            to="/libro-de-reclamaciones"
            className="group mt-6 flex items-center gap-3 rounded-xl border border-accent-500/50 bg-primary-900/40 p-3 transition-all duration-300 hover:border-accent-400 hover:bg-primary-900/70"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-xl text-black transition-transform duration-300 group-hover:scale-105">
              <i className="bi bi-journal-bookmark-fill" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-white">Libro de Reclamaciones</span>
              <span className="block text-xs text-surface-400">Registra tu reclamo o queja</span>
            </span>
            <i className="bi bi-arrow-right text-accent-400 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row sm:px-12">
        <div className="space-y-1.5 text-center sm:text-left">
          <p className="text-sm text-surface-300">
            © {new Date().getFullYear()} {CINE.nombre}. Todos los derechos reservados.
          </p>
          <p className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-xs text-surface-500 sm:justify-start">
            <span>Razón social: {CINE.razonSocial}</span>
            <span>RUC: {CINE.ruc}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 text-sm text-surface-500 transition-colors hover:text-accent-400"
        >
          Volver arriba <i className="bi bi-arrow-up-circle" aria-hidden="true" />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
