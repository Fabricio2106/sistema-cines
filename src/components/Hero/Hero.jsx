import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";
import { peliculas } from "../../data/peliculas";

// Solo películas con banner horizontal
const destacadas = peliculas.filter((p) => p.banner).slice(0, 5);

export default function Hero() {
  return (
    <section id="inicio" className="mt-16 w-full" aria-label="Películas destacadas">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        effect="fade"
        loop
        className="hero-swiper"
      >
        {destacadas.map((pelicula, i) => (
          <SwiperSlide key={pelicula.id}>
            <div className="relative w-full h-[420px] sm:h-[560px] lg:h-[680px]">
              <img
                src={pelicula.banner}
                alt={`Banner de ${pelicula.titulo}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent hidden sm:block" />

              <div className="absolute bottom-0 left-0 right-0 px-6 pb-14 sm:px-12 sm:pb-16 lg:px-16">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      {pelicula.genero}
                    </span>
                    <span className="bg-accent-500 text-black px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                      {pelicula.clasificacion}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
                    {pelicula.titulo}
                  </h2>

                  <p className="text-surface-200 text-sm sm:text-lg mb-6 max-w-2xl line-clamp-3">
                    {pelicula.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <Link
                      to={`/pelicula/${pelicula.id}#funciones`}
                      className="bg-accent-500 hover:bg-accent-600 text-black px-6 sm:px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-accent-500/50 transition-all duration-300 hover:scale-105"
                    >
                      Comprar entrada
                    </Link>
                    <Link
                      to={`/pelicula/${pelicula.id}`}
                      className="border-2 border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 rounded-full font-bold transition-all duration-300"
                    >
                      Más información
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
