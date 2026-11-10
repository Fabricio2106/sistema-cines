import React, { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para autenticar al usuario
    alert(`Intentando iniciar sesión con: ${form.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl mb-6 text-center font-bold">Iniciar Sesión</h2>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 rounded text-black"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-2 rounded text-black"
        />

        <button
          type="submit"
          className="w-full bg-accent-500 py-2 rounded font-bold hover:bg-accent-600 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
