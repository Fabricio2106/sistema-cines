import { reserva } from "./reserva";

// Patrón Strategy: cada método de pago es un objeto con esta forma:
//   { id, nombre, descripcion, icono, pagar({ pelicula, funcion, asientos, fecha }) → compra }
// `pagar` cobra (si corresponde) y devuelve la compra creada. Para agregar un método
// (Yape, tarjeta…) se crea su archivo en esta carpeta y se suma a METODOS; ni Resumen ni
// el resto del flujo cambian.
//
// Importante: un método que cobra debe confirmar el pago en el SERVIDOR (por ejemplo con la
// verificación de la pasarela) antes de crear la compra. Lo que diga el navegador no basta.
export const METODOS = [reserva];

export const procesarPago = (metodoId, datos) => {
  const metodo = METODOS.find((m) => m.id === metodoId);
  if (!metodo) throw new Error("Ese método de pago no está disponible");
  return metodo.pagar(datos);
};
