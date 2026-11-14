import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/cinerama-letras.png";
import { useAuth } from "../../context/AuthContext";

const navbarLinks = [
  { id: 1, title: "Inicio", link: "/", icono: "bi-house-door-fill" },
  { id: 2, title: "Estrenos", link: "/#estrenos", icono: "bi-film" },
  { id: 3, title: "Cómo llegar", link: "/como-llegar", icono: "bi-geo-alt-fill" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const perfilRef = useRef(null);
  const { pathname, hash } = useLocation();
  const { usuario, salir: cerrarSesion } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al navegar
  useEffect(() => {
    setIsOpen(false);
    setPerfilAbierto(false);
  }, [pathname, hash]);

  // Cierra el menú de perfil al hacer clic fuera o al pulsar Escape
  useEffect(() => {
    if (!perfilAbierto) return undefined;
    const fuera = (e) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) setPerfilAbierto(false);
    };
    const tecla = (e) => e.key === "Escape" && setPerfilAbierto(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [perfilAbierto]);

  const estaActivo = (link) => {
    const [ruta, ancla = ""] = link.split("#");
    return pathname === (ruta || "/") && hash === (ancla ? `#${ancla}` : "");
  };

  const salir = async () => {
    await cerrarSesion();
    toast.success("Cerraste tu sesión");
  };

  // El logo siempre lleva al inicio y sube al principio de la página
  const irAlInicio = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const claseLinkEscritorio = (link) =>
    `flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
      estaActivo(link)
        ? "bg-primary-600 text-white shadow-md shadow-primary-900/60"
        : "text-primary-100/80 hover:bg-white/10 hover:text-white"
    }`;

  const claseLinkMovil = (link) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-colors ${
      estaActivo(link) ? "bg-primary-600 text-white" : "text-primary-100/80 hover:bg-white/10 hover:text-white"
    }`;

  const botonIngresar =
    "flex items-center justify-center gap-2 rounded-full bg-accent-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300";
  const botonSalir =
    "flex items-center justify-center gap-2 rounded-full border border-primary-500/60 px-5 py-2 text-sm font-semibold text-white transition-colors hover:border-primary-400 hover:bg-primary-600";

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled || isOpen
          ? "border-b border-primary-700/40 bg-primary-950/95 shadow-xl shadow-black/40 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Principal" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-12">
        <Link to="/" onClick={irAlInicio} aria-label="Cinerama Pacífico, ir al inicio" className="shrink-0">
          <img
            src={logo}
            alt="Cinerama Pacífico"
            className="w-[130px] transition-transform duration-300 hover:scale-105 sm:w-[160px]"
          />
        </Link>

        {/* Escritorio: enlaces en cápsula */}
        <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md md:flex">
          {navbarLinks.map((item) => (
            <li key={item.id}>
              <Link to={item.link} className={claseLinkEscritorio(item.link)}>
                <i className={`bi ${item.icono}`} aria-hidden="true" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center md:flex">
          {usuario ? (
            <div ref={perfilRef} className="relative">
              <button
                type="button"
                onClick={() => setPerfilAbierto((abierto) => !abierto)}
                aria-label="Menú de perfil"
                aria-haspopup="menu"
                aria-expanded={perfilAbierto}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-400 text-xl text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300"
              >
                <i className="bi bi-person-fill" />
              </button>
              {perfilAbierto && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-primary-700/50 bg-primary-950 shadow-2xl shadow-black/50"
                >
                  <div className="border-b border-primary-800/60 px-4 py-3">
                    <p className="text-xs text-primary-100/50">Sesión iniciada como</p>
                    <p className="truncate text-sm font-semibold text-white">{usuario.email}</p>
                  </div>
                  <Link
                    to="/perfil?tab=datos"
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-primary-100/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <i className="bi bi-person-vcard-fill text-accent-400" aria-hidden="true" />
                    Mis datos
                  </Link>
                  <Link
                    to="/perfil?tab=compras"
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-primary-100/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <i className="bi bi-ticket-perforated-fill text-accent-400" aria-hidden="true" />
                    Mis compras
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={salir}
                    className="flex w-full items-center gap-3 border-t border-primary-800/60 px-4 py-3 text-left text-sm font-semibold text-primary-100/80 transition-colors hover:bg-primary-600 hover:text-white"
                  >
                    <i className="bi bi-box-arrow-right" aria-hidden="true" />
                    Salir
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className={botonIngresar}>
              <i className="bi bi-person-circle" />
              Ingresar
            </NavLink>
          )}
        </div>

        {/* Botón de menú móvil */}
        <button
          type="button"
          className="rounded-full border border-white/15 p-2.5 text-white transition-colors hover:bg-primary-600 md:hidden"
          onClick={() => setIsOpen((abierto) => !abierto)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="menu-movil"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        className={`absolute left-0 w-full border-t border-primary-800/60 bg-primary-950 shadow-2xl transition-all duration-300 md:hidden ${
          isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <ul className="space-y-1 px-4 py-4">
          {navbarLinks.map((item) => (
            <li key={item.id}>
              <Link to={item.link} className={claseLinkMovil(item.link)}>
                <i className={`bi ${item.icono}`} aria-hidden="true" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-primary-800/60 px-4 py-4">
          {usuario ? (
            <>
              <div className="mb-3 flex items-center gap-3 px-1">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-400 text-xl text-black">
                  <i className="bi bi-person-fill" aria-hidden="true" />
                </span>
                <span className="min-w-0 truncate text-sm font-semibold text-white">{usuario.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/perfil?tab=datos" className={botonSalir}>
                  <i className="bi bi-person-vcard-fill text-accent-400" />
                  Mis datos
                </Link>
                <Link to="/perfil?tab=compras" className={botonSalir}>
                  <i className="bi bi-ticket-perforated-fill text-accent-400" />
                  Mis compras
                </Link>
                <button type="button" onClick={salir} className={`${botonSalir} col-span-2`}>
                  <i className="bi bi-box-arrow-right" />
                  Salir
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className={`${botonIngresar} w-full`}>
              <i className="bi bi-person-circle" />
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
