const ErrorConfiguracion = () => (
  <main className="min-h-screen flex items-center justify-center px-6 text-center text-white">
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-3">El sitio no está disponible por ahora</h1>
      <p className="text-surface-300 mb-6">Estamos resolviendo un problema de conexión. Vuelve a intentarlo en unos minutos.</p>
      <p className="text-xs text-surface-500">
        Para el administrador: faltan las variables <code>VITE_SUPABASE_URL</code> y{" "}
        <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>. Cárgalas en Vercel (Settings → Environment
        Variables) y vuelve a desplegar.
      </p>
    </div>
  </main>
);

export default ErrorConfiguracion;
