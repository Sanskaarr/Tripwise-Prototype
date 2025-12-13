/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#010A3A',
          DEFAULT: '#002672',
        },
        ice: {
          white: '#F8FBFF',
          frost: 'rgba(248, 251, 255, 0.1)',
        },
        aurora: {
          blue: '#4A9EFF',
          purple: '#7B61FF',
          pink: '#FF6B9D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      animation: {
        'aurora-shift': 'aurora-shift 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
