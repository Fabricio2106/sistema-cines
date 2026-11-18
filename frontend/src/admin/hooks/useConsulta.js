import { useEffect, useState } from "react";

// Ejecuta una consulta async al montar y entrega { datos, cargando, error, recargar }.
// `consultar` debe ser estable (un método de repositorio, no una función creada al vuelo).
export const useConsulta = (consultar) => {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: "" });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    consultar()
      .then((datos) => activo && setEstado({ datos, cargando: false, error: "" }))
      .catch((err) => activo && setEstado((prev) => ({ ...prev, cargando: false, error: err.message })));
    return () => {
      activo = false;
    };
  }, [consultar, version]);

  return { ...estado, recargar: () => setVersion((v) => v + 1) };
};

// Une un repositorio con su lista: expone `datos` y envuelve las operaciones que cambian
// datos (crear, actualizar y las indicadas en `acciones`) para recargar la lista al terminar.
export const useRepositorio = (repo, acciones = []) => {
  const { datos, cargando, error, recargar } = useConsulta(repo.listar);

  const metodos = {};
  for (const nombre of ["crear", "actualizar", ...acciones]) {
    if (!repo[nombre]) continue;
    metodos[nombre] = async (...args) => {
      const resultado = await repo[nombre](...args);
      recargar();
      return resultado;
    };
  }

  return { datos: datos ?? [], cargando, error, ...metodos };
};
