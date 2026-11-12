import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logocine.png";
import { CINE } from "../../data/cine";
import { useAuth } from "../../context/AuthContext";

const navbarLinks = [
  { id: 1, title: "Inicio", link: "/" },
  { id: 2, title: "Estrenos", link: "/#estrenos" },
  { id: 3, title: "Cómo llegar", link: "/como-llegar" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const { usuario, salir } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al navegar
  useEffect(() => setIsOpen(false), [pathname, hash]);

  const estaActivo = (link) => {
    const [ruta, ancla = ""] = link.split("#");
    return pathname === (ruta || "/") && hash === (ancla ? `#${ancla}` : "");
  };

  const claseLink = (link) =>
    `relative font-medium transition-colors duration-300 ${
      estaActivo(link) ? "text-accent-400" : "text-white hover:text-accent-400"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-primary-700/30 ${
        scrolled || isOpen
          ? "bg-primary-950/95 backdrop-blur-lg shadow-lg shadow-primary-900/30"
          : "bg-primary-900/40 backdrop-blur-lg"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 sm:px-12 sm:py-4 max-w-7xl mx-auto">
        <Link to="/" aria-label="Cinerama Pacífico, ir al inicio">
          <img
            src={logo}
            alt="Cinerama Pacífico"
            className="w-[110px] sm:w-[120px] hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Escritorio */}
        <ul className="hidden md:flex items-center gap-8">
          {navbarLinks.map((item) => (
            <li key={item.id}>
              <Link to={item.link} className={`${claseLink(item.link)} text-lg`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          <a
            href={CINE.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de Cinerama Pacífico"
            className="text-white text-xl hover:text-accent-400 hover:scale-110 transition-all duration-300"
          >
            <i className="bi bi-facebook" />
          </a>
          {usuario ? (
            <>
              <NavLink to="/mis-entradas" className={`${claseLink("/mis-entradas")} text-sm`}>
                Mis entradas
              </NavLink>
              <button
                type="button"
                onClick={salir}
                title={usuario.email}
                className="flex items-center gap-2 border-2 border-accent-500 text-accent-400 hover:bg-accent-500 hover:text-black font-bold px-4 py-1.5 rounded-full transition-colors"
              >
                <i className="bi bi-box-arrow-right" />
                Salir
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-black font-bold px-5 py-2 rounded-full transition-colors"
            >
              <i className="bi bi-person-circle" />
              Ingresar
            </NavLink>
          )}
        </div>

        {/* Botón de menú móvil */}
        <button
          type="button"
          className="md:hidden text-white p-2 hover:bg-primary-800/50 rounded-lg transition-colors"
          onClick={() => setIsOpen((abierto) => !abierto)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="menu-movil"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        className={`md:hidden absolute w-full bg-primary-950/95 backdrop-blur-md shadow-2xl transition-all duration-300 ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <ul className="flex flex-col px-4 py-2">
          {navbarLinks.map((item) => (
            <li key={item.id} className="border-b border-primary-800/50 last:border-0">
              <Link to={item.link} className={`${claseLink(item.link)} block py-3 text-center`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-6 px-4 py-4 border-t border-primary-700/50 bg-primary-900/30">
          <a
            href={CINE.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de Cinerama Pacífico"
            className="text-white text-2xl hover:text-accent-400 transition-colors"
          >
            <i className="bi bi-facebook" />
          </a>
          {usuario ? (
            <>
              <Link to="/mis-entradas" className="text-white font-medium hover:text-accent-400">
                Mis entradas
              </Link>
              <button
                type="button"
                onClick={salir}
                className="flex items-center gap-2 border-2 border-accent-500 text-accent-400 font-bold px-5 py-1.5 rounded-full"
              >
                <i className="bi bi-box-arrow-right" />
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-black font-bold px-6 py-2 rounded-full transition-colors"
            >
              <i className="bi bi-person-circle" />
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
