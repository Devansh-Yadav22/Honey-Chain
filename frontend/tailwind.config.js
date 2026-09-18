/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        forest: {
          50: '#F4F7F3',
          100: '#E8EFE7',
          200: '#D2DFD0',
          300: '#AEC5AB',
          400: '#7F9E7B',
          500: '#587B54',
          600: '#466743',
          700: '#3D5A3A',
          800: '#2E4A2E',
          900: '#1E351C',
          950: '#11200F',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        honey: {
          light: '#FFFDF9',
          cream: '#FAF7F2',
          card: '#FFFFFF',
          border: '#EAE3D9',
          gold: '#D97706',
          amber: '#B45309',
          dark: '#292524',
        }
      }
    },
  },
  plugins: [],
}
