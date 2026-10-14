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
          forest: '#25855A', // Primary green
          deep: '#173C2B',   // Deep emerald text & accents
          fresh: '#25855A',
          lime: '#C7F38A',   // Soft lime
          mint: '#DDF4E4',   // Pale mint
          teal: '#4EA879',
        },
        surface: {
          main: '#F3F8F2',     // Main background
          secondary: '#E7F1E8',// Secondary background
          ivory: '#F3F8F2',
          white: 'rgba(255, 255, 255, 0.85)',
          glass: 'rgba(255, 255, 255, 0.58)',
          glassLight: 'rgba(255, 255, 255, 0.75)',
        },
        text: {
          primary: '#173C2B',   // Deep emerald text
          secondary: '#64786C', // Secondary muted text
          emerald: '#25855A',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.85)',
          glass: 'rgba(255, 255, 255, 0.85)',
          emeraldSubtle: 'rgba(37, 133, 90, 0.15)',
        },
        badge: {
          discount: '#FFE2D9', // Soft coral for discount badges
          discountText: '#9C3C27',
        },
        accent: {
          coral: '#FFE2D9',
          amber: '#9C3C27',
          warning: '#B86B22',
          critical: '#B94C3A',
        }
      },
      boxShadow: {
        'glass-sm': '0 4px 16px rgba(35, 88, 58, 0.05)',
        'glass': '0 8px 32px rgba(35, 88, 58, 0.08)',
        'glass-hover': '0 16px 40px rgba(35, 88, 58, 0.12)',
        'emerald-glow': '0 0 25px rgba(37, 133, 90, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
