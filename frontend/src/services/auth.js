import { supabase } from "./supabase";

const aUsuario = (user) =>
  user ? { id: user.id, email: user.email, nombre: user.user_metadata?.nombre ?? user.email } : null;

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
export const registrar = async ({ nombre, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { nombre: nombre.trim() } },
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
