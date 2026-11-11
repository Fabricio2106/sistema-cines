// Una película cuenta como "estreno" hasta 14 días después de su fecha de estreno.
const DIAS_COMO_ESTRENO = 14;

export const esEstreno = (fechaEstreno) => {
  if (!fechaEstreno) return false;
  const dias = (Date.now() - new Date(`${fechaEstreno}T00:00:00`).getTime()) / 86400000;
  return dias >= 0 && dias <= DIAS_COMO_ESTRENO;
};
