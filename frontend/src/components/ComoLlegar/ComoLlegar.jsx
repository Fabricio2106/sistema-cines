import React from "react";

const ComoLlegar = () => {
  return (
    <section id="como-llegar" className="py-16 px-6 sm:px-12 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Encuéntranos
          </h2>
          <div className="w-24 h-1 bg-accent-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Visítanos y disfruta del mejor cine</p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Información de ubicación - 2 columnas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dirección */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-primary-600/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Dirección</h3>
                  <p className="text-gray-300 text-sm">Av. Principal 123</p>
                  <p className="text-gray-400 text-sm">Iquitos, Perú</p>
                  <p className="text-gray-500 text-xs mt-1">Centro comercial Multicines</p>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-accent-400/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Horarios</h3>
                  <p className="text-gray-300 text-sm">Lunes a Domingo</p>
                  <p className="text-accent-400 font-semibold">11:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-primary-600/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Contacto</h3>
                  <p className="text-gray-300 text-sm">(065) 123-4567</p>
                  <p className="text-gray-400 text-sm">contacto@multicinesiquitos.com</p>
                </div>
              </div>
            </div>

            {/* Estacionamiento */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-accent-400/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Estacionamiento</h3>
                  <p className="text-gray-300 text-sm">Disponible en el centro comercial</p>
                  <p className="text-green-400 text-xs mt-1">✓ Gratis para clientes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa - 3 columnas */}
          <div className="lg:col-span-3">
            <div className="h-full min-h-[500px] rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-primary-600/50 transition-all duration-300">
              <iframe
                title="Mapa de Multicines Iquitos"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.337425630249!2d-73.25032588468104!3d-3.743373597232779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9100e77d67b0f57d%3A0xd3dd7ef6d5f7f1a7!2sMulticines%20Iquitos!5e0!3m2!1ses-419!2spe!4v1691443200000!5m2!1ses-419!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComoLlegar;