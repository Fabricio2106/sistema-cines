// Repositorio genérico que guarda las filas en memoria (maqueta). Devuelve copias para que
// la interfaz nunca modifique el almacén por accidente. Al conectar Supabase se reemplaza
// cada repositorio por uno que use `supabase.from(...)`, con los mismos métodos.
export const crearRepositorioEnMemoria = (inicial, { nuevoId, preparar = (fila) => fila }) => {
  let filas = structuredClone(inicial);

  return {
    listar: async () => structuredClone(filas),

    crear: async (datos) => {
      const fila = preparar({ ...datos, id: nuevoId(datos, filas) });
      filas = [fila, ...filas];
      return structuredClone(fila);
    },

    actualizar: async (id, cambios) => {
      let actualizada = null;
      filas = filas.map((f) => {
        if (f.id !== id) return f;
        actualizada = preparar({ ...f, ...cambios }, f);
        return actualizada;
      });
      if (!actualizada) throw new Error("No se encontró el registro");
      return structuredClone(actualizada);
    },

    buscar: async (id) => structuredClone(filas.find((f) => f.id === id) ?? null),

    // Para repositorios que necesitan operar sobre las filas (ver compras.js).
    _modificar: (fn) => {
      filas = fn(filas);
    },
    _filas: () => filas,
  };
};
