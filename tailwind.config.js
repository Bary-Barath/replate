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
          deep: '#061713',
          fresh: '#62D6A5',
          lime: '#B9F77A',
          teal: '#2FBF9F',
        },
        surface: {
          ivory: '#061713',
          white: '#102C23',
          glass: 'rgba(255,255,255,0.07)',
        },
        text: {
          primary: '#F4FFF8',
          secondary: '#A9BEB4',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.16)',
        },
        accent: {
          amber: '#F0B44D',
          warning: '#D97706',
          critical: '#F47C7C',
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
