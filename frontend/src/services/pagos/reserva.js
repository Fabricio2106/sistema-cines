import { crearCompra } from "../compras";

// Método actual: no se cobra, solo se reservan las butacas.
export const reserva = {
  id: "reserva",
  nombre: "Reservar sin pago",
  descripcion: "Todavía no se cobra ningún pago: la compra solo reserva tus butacas.",
  icono: "bi-ticket-perforated-fill",
  pagar: crearCompra,
};
