/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        'soft-white': '#F9F6F1',
        beige: '#F5F0E8',
        sand: '#EFE8DC',
        peach: '#FAF2ED',
        sky: '#F4F7FA',
        blush: '#FDF5F5',
        charcoal: '#2B2B2B',
        gray: '#5A5A5A',
        'mid-gray': '#8E8E8E',
        'accent-coral': '#E8AFA0',
        'accent-sage': '#B8C9B4',
        'accent-lavender': '#D4C5D9',
        'accent-sky': '#B8D4E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'elegant': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
