/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1f3b5b",     // Logo lacivert
        secondary: "#3bb7a4",   // Logo yeşil
        accent: "#f59e0b",      // Turuncu nokta
      },
    },
  },
  plugins: [],
};