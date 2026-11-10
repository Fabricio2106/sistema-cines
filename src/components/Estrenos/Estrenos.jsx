import PeliculaCard from "../PeliculaCard/PeliculaCard";
import { peliculas } from "../../data/peliculas";

const Estrenos = () => {
  return (
    <section id="estrenos" className="py-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center border-b-2 border-accent-400 pb-3 text-white">
          Estrenos de la Semana
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {peliculas.map((pelicula) => (
            <PeliculaCard key={pelicula.id} pelicula={pelicula} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Estrenos;
