/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        "brand-dark": "#0d1117",
        "brand-light-dark": "#161b22",
        "brand-border": "#30363d",
        "brand-primary": "#58a6ff",
        "brand-text": "#c9d1d9",
        "brand-text-secondary": "#8b949e",
        "neutral-gray": "#6a737d",
      },
      boxShadow: {
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.08)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
