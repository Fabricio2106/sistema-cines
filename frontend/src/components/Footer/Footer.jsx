import { Link } from "react-router-dom";
import { CINE } from "../../data/cine";
import logo from "../../assets/cinerama-letras.png";

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
  <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
    {children}
    <span className="mt-2 block h-0.5 w-8 rounded bg-primary-500" aria-hidden="true" />
  </h3>
);

const ListaEnlaces = ({ enlaces }) => (
  <ul className="space-y-4 text-sm">
    {enlaces.map(([texto, ruta]) => (
      <li key={ruta}>
        <Link to={ruta} className="inline-flex items-center gap-2 transition-colors hover:text-white">
          <i className="bi bi-chevron-right text-xs text-primary-500" aria-hidden="true" />
          {texto}
        </Link>
      </li>
    ))}
  </ul>
);

const DatoContacto = ({ icono, children }) => (
  <li className="flex items-start gap-4">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-primary-400">
      <i className={`bi ${icono}`} aria-hidden="true" />
    </span>
    <span className="pt-1.5 leading-snug">{children}</span>
  </li>
);

const Footer = () => (
  <footer className="mt-28 bg-primary-950 text-primary-100/70">
    {/* Franja de color de marca */}
    <div className="h-1.5 bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400" aria-hidden="true" />

    <div className="mx-auto max-w-7xl px-6 pb-14 pt-20 sm:px-12">
      <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.4fr]">
        {/* Marca y redes */}
        <div>
          <img src={logo} alt={CINE.nombre} className="w-44" />
          <p className="mt-6 max-w-xs text-sm leading-7">
            Tu cine en Miraflores. Los mejores estrenos con la mejor calidad de imagen y sonido.
          </p>
          <ul className="mt-8 flex gap-3" aria-label="Redes sociales">
            {CINE.redes.map((red) => (
              <li key={red.nombre}>
                <a
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={red.nombre}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-400 hover:text-black"
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

        {/* Contacto */}
        <div>
          <Titulo>Contacto</Titulo>
          <ul className="space-y-5 text-sm">
            <DatoContacto icono="bi-geo-alt-fill">
              {CINE.direccion}
              <br />
              {CINE.ciudad}
            </DatoContacto>
            <DatoContacto icono="bi-telephone-fill">
              <a href={CINE.telefonoEnlace} className="transition-colors hover:text-white">{CINE.telefono}</a>
              {" · "}
              <a href={CINE.celularEnlace} className="transition-colors hover:text-white">{CINE.celular}</a>
            </DatoContacto>
            <DatoContacto icono="bi-envelope-fill">
              <a href={`mailto:${CINE.correo}`} className="break-all transition-colors hover:text-white">{CINE.correo}</a>
            </DatoContacto>
            <DatoContacto icono="bi-clock-fill">{CINE.horario}</DatoContacto>
          </ul>
        </div>
      </div>

      {/* Libro de Reclamaciones */}
      <Link
        to="/libro-de-reclamaciones"
        className="group mt-16 flex flex-col items-start gap-4 rounded-2xl border border-primary-700/40 bg-primary-900/60 p-6 transition-colors duration-300 hover:border-accent-400/60 sm:flex-row sm:items-center"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-400 text-xl text-black">
          <i className="bi bi-journal-bookmark-fill" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-white">Libro de Reclamaciones</span>
          <span className="block text-sm text-primary-100/60">¿Tuviste algún problema? Registra tu reclamo o queja aquí.</span>
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-400">
          Ir al libro <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </div>

    <div className="border-t border-primary-800/60 bg-black/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row sm:px-12">
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-sm text-primary-100/80">
            © {new Date().getFullYear()} {CINE.nombre}. Todos los derechos reservados.
          </p>
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-primary-100/50 sm:justify-start">
            <span>Razón social: {CINE.razonSocial}</span>
            <span>RUC: {CINE.ruc}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 text-sm text-primary-100/60 transition-colors hover:text-accent-400"
        >
          Volver arriba <i className="bi bi-arrow-up-circle" aria-hidden="true" />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
