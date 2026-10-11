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
          forest: '#25855A',
          deep: '#173C2B',
          fresh: '#25855A',
          lime: '#DDF4E4',
          teal: '#4EA879',
        },
        surface: {
          ivory: '#F3F8F2',
          white: 'rgba(255,255,255,0.82)',
          glass: 'rgba(255,255,255,0.58)',
        },
        text: {
          primary: '#173C2B',
          secondary: '#64786C',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.85)',
        },
        accent: {
          amber: '#9C3C27',
          warning: '#B86B22',
          critical: '#B94C3A',
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
