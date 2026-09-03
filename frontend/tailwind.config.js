/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          900: '#78350f',
        },
        honey: {
          gold: '#eab308',
          amber: '#f59e0b',
          dark: '#1c1917',
          card: '#262626',
        }
      }
    },
  },
  plugins: [],
}
