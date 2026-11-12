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
        // Rojo de marca (logo Cinerama #E5322D): navbar, badges, bordes y botones secundarios.
        // Los tonos 800-950 son oscuros casi neutros para que el logo rojo resalte sobre ellos.
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f2685f",
          500: "#e5322d",
          600: "#cc2a26",
          700: "#a31f1d",
          800: "#4a1716",
          900: "#2b1010",
          950: "#160909",
        },
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
