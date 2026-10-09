/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#174D3A',
          deep: '#103B2D',
          fresh: '#2F7D57',
        },
        surface: {
          ivory: '#FAF8F2',
          white: '#FFFFFF',
        },
        text: {
          primary: '#202722',
          secondary: '#70776F',
        },
        border: {
          DEFAULT: '#E7E9E3',
        },
        accent: {
          amber: '#F0B44D',
          warning: '#D97706',
          critical: '#C83D3D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
