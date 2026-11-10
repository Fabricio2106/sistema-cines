import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-primary-900/30 text-gray-400 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Contenido principal */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Columna 1: Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent-400 rounded"></span>
              Multicines Iquitos
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Tu cine de confianza en Iquitos. Disfruta de las mejores películas con la mejor calidad de imagen y sonido.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent-400 rounded"></span>
              Enlaces rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#inicio" className="hover:text-accent-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary-600 rounded-full group-hover:bg-accent-400 transition-colors"></span>
                  Inicio
                </a>
              </li>
              <li>
                <a href="#estrenos" className="hover:text-accent-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary-600 rounded-full group-hover:bg-accent-400 transition-colors"></span>
                  Estrenos
                </a>
              </li>
              <li>
                <a href="#normas" className="hover:text-accent-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary-600 rounded-full group-hover:bg-accent-400 transition-colors"></span>
                  Normas
                </a>
              </li>
              <li>
                <a href="#como-llegar" className="hover:text-accent-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary-600 rounded-full group-hover:bg-accent-400 transition-colors"></span>
                  Cómo llegar
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent-400 rounded"></span>
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Av. Principal 123, Iquitos</li>
              <li>Tel: (065) 123-4567</li>
              <li>contacto@multicinesiquitos.com</li>
            </ul>
            
            {/* Redes sociales */}
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-primary-900/50 border border-primary-700 flex items-center justify-center text-primary-300 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-primary-900/50 border border-primary-700 flex items-center justify-center text-primary-300 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="mailto:contacto@multicinesiquitos.com"
                aria-label="Email"
                className="w-10 h-10 rounded-full bg-accent-900/30 border border-accent-700/50 flex items-center justify-center text-accent-500 hover:bg-accent-500 hover:text-black hover:border-accent-400 transition-all duration-300"
              >
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary-900/30 pt-6">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} Multicines Iquitos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;