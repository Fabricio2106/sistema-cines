import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logocine.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navbarRedes = [
    {
      id: 1,
      title: "Iniciar Sesión",
      link: "/login", 
      icon: "bi bi-person-circle",
    },
    {
      id: 2,
      title: "facebook",
      link: "https://www.facebook.com",
      icon: "bi bi-facebook",
    },
  ];

  const navbarLinks = [
    {
      id: 1,
      title: "Inicio",
      link: "/",
    },
    {
      id: 2,
      title: "Estrenos",
      link: "/#estrenos",
    },
    {
      id: 3,
      title: "Normas",
      link: "/#normas",
    },
    {
      id: 4,
      title: "Cómo llegar",
      link: "/#como-llegar",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary-900/40 backdrop-blur-lg z-50 transition-all duration-300 border-b border-primary-700/30 shadow-lg shadow-primary-900/20">
      <div className="flex justify-between items-center sm:px-12 sm:py-4 px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="logo del sitio" 
            className="w-[120px] hover:scale-105 transition-transform duration-300" 
          />
        </div>

        {/* Botón de menú hamburguesa - visible solo en móvil */}
        <button 
          className="md:hidden text-white p-2 hover:bg-primary-800/50 rounded-lg transition-colors" 
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navegación - visible en desktop */}
        <div className="hidden md:block">
          <ul className="flex sm:space-x-8 space-x-4">
            {navbarLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.link}
                  className="sm:text-lg text-sm text-white hover:text-accent-400 transition-all duration-300 font-medium relative group"
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Redes - visible en desktop */}
        <div className="hidden md:block">
          <ul className="flex space-x-4">
            {navbarRedes.map((link) => (
              <li key={link.id}>
                {link.link.startsWith("http") ? (
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-125 hover:text-accent-400"
                  >
                    <i
                      className={`${link.icon} sm:text-2xl text-lg text-white transition-colors duration-300`}
                    ></i>
                  </a>
                ) : (
                  <Link
                    to={link.link}
                    className="inline-block transition-all duration-300 hover:scale-125 hover:text-accent-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <i
                      className={`${link.icon} sm:text-2xl text-lg text-white transition-colors duration-300`}
                    ></i>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden absolute w-full bg-primary-950/95 backdrop-blur-md transition-all duration-300 shadow-2xl ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        {/* Links de navegación móvil */}
        <ul className="flex flex-col px-4 py-4">
          {navbarLinks.map((link) => (
            <li key={link.id} className="py-3 text-center border-b border-primary-800/50 last:border-0">
              <Link
                to={link.link}
                className="text-white hover:text-accent-400 block font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Redes sociales móvil */}
        <ul className="flex space-x-6 px-4 py-4 border-t border-primary-700/50 justify-center bg-primary-900/30">
          {navbarRedes.map((link) => (
            <li key={link.id}>
              {link.link.startsWith("http") ? (
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-125 transition-transform duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`${link.icon} text-2xl text-white hover:text-accent-400 transition-colors`}></i>
                </a>
              ) : (
                <Link
                  to={link.link}
                  className="inline-block hover:scale-125 transition-transform duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`${link.icon} text-2xl text-white hover:text-accent-400 transition-colors`}></i>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;