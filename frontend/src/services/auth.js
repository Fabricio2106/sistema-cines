import { supabase } from "./supabase";

const aUsuario = (user) => {
  if (!user) return null;
  const m = user.user_metadata ?? {};
  const nombre = m.nombre ?? user.email;
  const apellidos = m.apellidos ?? "";
  return {
    id: user.id,
    email: user.email,
    nombre,
    apellidos,
    nombreCompleto: `${nombre} ${apellidos}`.trim(),
    dni: m.dni ?? "",
    celular: m.celular ?? "",
    fechaNacimiento: m.fecha_nacimiento ?? "",
    genero: m.genero ?? "",
    promociones: Boolean(m.acepta_promociones),
  };
};

const traducir = (error) => {
  const mensajes = {
    "Invalid login credentials": "Correo o contraseña incorrectos",
    "User already registered": "Ya existe una cuenta con ese correo",
    "Email not confirmed": "Confirma tu correo antes de ingresar",
  };
  return new Error(mensajes[error.message] ?? error.message);
};

export const sesionActual = async () => {
  const { data } = await supabase.auth.getSession();
  return aUsuario(data.session?.user);
};

// Avisa cada vez que la sesión cambia (ingreso, salida, otra pestaña).
export const alCambiarSesion = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((_evento, session) =>
    callback(aUsuario(session?.user))
  );
  return () => data.subscription.unsubscribe();
};

// Devuelve `true` si ya quedó con sesión; `false` si Supabase exige confirmar
// el correo antes de ingresar.
export const registrar = async ({
  nombre,
  apellidos,
  dni,
  fechaNacimiento,
  genero,
  celular,
  email,
  password,
  promociones,
}) => {
  const ahora = new Date().toISOString();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        dni,
        celular,
        fecha_nacimiento: fechaNacimiento,
        genero,
        acepta_terminos_en: ahora,
        acepta_promociones: Boolean(promociones),
      },
    },
  });
  if (error) throw traducir(error);
  // Con correo ya registrado y confirmación activa, Supabase no da error: devuelve identities vacío.
  if (data.user && data.user.identities?.length === 0) {
    throw new Error("Ya existe una cuenta con ese correo");
  }
  return Boolean(data.session);
};

export const ingresar = async ({ email, password }) => {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw traducir(error);
};

export const salir = async () => {
  await supabase.auth.signOut();
};

export const actualizarDatos = async ({ nombre, apellidos, fechaNacimiento, genero, celular, promociones }) => {
  const { error } = await supabase.auth.updateUser({
    data: {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      celular,
      fecha_nacimiento: fechaNacimiento,
      genero,
      acepta_promociones: Boolean(promociones),
    },
  });
  if (error) throw traducir(error);
};

export const cambiarPassword = async (password) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw traducir(error);
};

// Envía un correo con un enlace para elegir una contraseña nueva. Supabase responde igual
// exista o no la cuenta, así que no se revela qué correos están registrados.
export const enviarCorreoRecuperacion = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/restablecer-contrasena`,
  });
  if (error) throw traducir(error);
};
