import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Morado de marca: navbar, badges, bordes y botones secundarios
        primary: colors.purple,
        // Amarillo de acción: botones de compra, rating y acentos
        accent: colors.yellow,
        // Fondos de tarjetas y paneles
        surface: colors.gray,
      },
      fontFamily: {
        miFuenteRubik: ["Rubik", "sans-serif"]
      }
    },
  },
  plugins: [],
}
