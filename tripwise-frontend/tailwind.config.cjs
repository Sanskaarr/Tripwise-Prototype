/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "Manrope", "sans-serif"],
        display: ["Playfair Display", "Manrope", "serif"],
        script: ["Homemade Apple", "Caveat", "cursive"],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.4)",
        input: "#e2e8f0",
        ring: "#0EA5E9",
        background: "#F0F9FF",
        foreground: "#0F172A",
        primary: {
          DEFAULT: "#0EA5E9",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#0F172A",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#64748B",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "rgba(255, 255, 255, 0.4)",
          foreground: "#0F172A",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0F172A",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.7)",
          foreground: "#0F172A",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.7)",
          border: "rgba(255, 255, 255, 0.4)",
        }
      },
      borderRadius: {
        lg: "2rem",
        md: "1rem",
        sm: "0.5rem",
        full: "9999px",
      },
      boxShadow: {
        'glass': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'float': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "fade-in": "fade-in 0.8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
