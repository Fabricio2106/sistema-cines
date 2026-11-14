export const GENEROS = ["Femenino", "Masculino", "Otro", "Prefiero no decirlo"];

export const hoy = () => new Date().toISOString().slice(0, 10);

export const soloDigitos = (valor, max) => valor.replace(/\D/g, "").slice(0, max);
