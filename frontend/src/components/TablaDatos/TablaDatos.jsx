// Tabla general del proyecto: un solo diseño para todas las listas (películas, funciones, ventas…).
//   <TablaDatos
//     columnas={[{ titulo: "Película", celda: (f) => f.titulo, clase: "font-semibold" }]}
//     filas={lista}
//     claveFila={(f) => f.id}
//   />
// columnas   cada una con `titulo`, `celda(fila)` (lo que se dibuja) y `clase` opcional para la celda.
// claveFila  devuelve un identificador único de la fila.
// claseFila  clases opcionales por fila, por ejemplo para atenuar lo desactivado.
// vacio      texto que se muestra cuando no hay filas.
// className  para darle alto a la tabla: con `lg:min-h-0 lg:flex-1` dentro de un contenedor de alto
//            fijo, la tabla se desplaza por dentro y el encabezado queda fijo.
const TablaDatos = ({ columnas, filas, claveFila, claseFila, vacio = "No hay datos para mostrar.", className = "" }) => {
  if (filas.length === 0) {
    return <p className="px-5 py-6 text-center text-sm text-primary-100/60">{vacio}</p>;
  }

  return (
    <div className={`scroll-cine overflow-auto ${className}`}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-primary-800/60 text-xs uppercase tracking-wider text-primary-100/50">
            {columnas.map((c) => (
              <th key={c.titulo} scope="col" className="sticky top-0 z-10 bg-primary-950 px-5 py-3 font-bold">
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-800/40">
          {filas.map((fila) => (
            <tr key={claveFila(fila)} className={claseFila?.(fila) ?? ""}>
              {columnas.map((c) => (
                <td key={c.titulo} className={`px-5 py-3 ${c.clase ?? ""}`}>
                  {c.celda(fila)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDatos;
