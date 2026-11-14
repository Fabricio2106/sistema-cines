import Skeleton from "react-loading-skeleton";

// Esqueleto de una página con póster y texto, mientras carga la cartelera.
const PaginaCargando = () => (
  <main className="min-h-screen px-6 pb-16 pt-28 sm:px-12" aria-busy="true" aria-label="Cargando">
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[280px_1fr]">
      <Skeleton height={420} borderRadius={16} />
      <div>
        <Skeleton height={40} width="70%" />
        <Skeleton height={20} width="40%" className="mt-3" />
        <Skeleton count={4} className="mt-6" />
        <Skeleton height={48} width="50%" borderRadius={999} className="mt-8" />
      </div>
    </div>
  </main>
);

export default PaginaCargando;
