/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5b8fc",
          400: "#8b93f8",
          500: "#6366f1",
          600: "#1d4ed8",
          700: "#1e3a8a",
          800: "#1e293b",
          900: "#0f172a",
          950: "#080f1e",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "blue-glow": "0 4px 24px 0 rgba(37, 99, 235, 0.18)",
        "card": "0 1px 4px 0 rgba(15,23,42,0.07)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
}