import React from "react";

const Normas = () => {
  const normas = [
    {
      numero: "01",
      texto: "Antes de retirarse de la ventanilla, sírvase verificar su ticket de entrada (horario de función, película, sala y monto que pagó por él). La empresa no efectuará cambios ni devoluciones posteriores. Prohibido el ingreso con animales domésticos."
    },
    {
      numero: "02",
      texto: "Todo niño a partir de tres (03) años paga."
    },
    {
      numero: "03",
      texto: "La empresa se reserva el derecho de cambiar los horarios de las películas sin previo aviso."
    },
    {
      numero: "04",
      texto: "La empresa no se responsabiliza por la pérdida de sus pertenencias."
    },
    {
      numero: "05",
      texto: "Multicines Iquitos no tiene ninguna tarjeta de afiliación para promociones."
    },
    {
      numero: "06",
      texto: "Todo billete falso será marcado."
    },
    {
      numero: "07",
      texto: "La empresa Multicines Iquitos cuenta con libro de reclamaciones."
    }
  ];

  return (
    <section id="normas" className="py-16 px-6 sm:px-12 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Normas y Políticas
          </h2>
          <div className="w-24 h-1 bg-accent-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Para garantizar una mejor experiencia</p>
        </div>
        
        {/* Grid de normas */}
        <div className="grid md:grid-cols-2 gap-6">
          {normas.map((norma) => (
            <div 
              key={norma.numero}
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-primary-600/50 transition-all duration-300 group"
            >
              {/* Número decorativo */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">{norma.numero}</span>
              </div>
              
              {/* Contenido */}
              <div className="ml-8 mt-2">
                <p className="text-gray-300 leading-relaxed">
                  {norma.texto}
                </p>
              </div>

              {/* Línea decorativa inferior */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-600 to-accent-400 group-hover:w-full transition-all duration-500 rounded-b-xl"></div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-gradient-to-r from-accent-900/20 to-accent-800/20 border-l-4 border-accent-400 rounded-r-xl">
          <p className="text-accent-400 font-semibold">
            El incumplimiento de estas normas puede resultar en la expulsión del establecimiento sin derecho a reembolso.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Normas;