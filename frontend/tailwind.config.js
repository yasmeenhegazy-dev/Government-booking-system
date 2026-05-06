/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Tajawal", "Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#0A2540",
          50: "#E7EBF0",
          100: "#C2CCD9",
          200: "#8497B4",
          300: "#4D6489",
          400: "#1F3C66",
          500: "#0A2540",
          600: "#081E36",
          700: "#06182C",
          800: "#041122",
          900: "#020A18",
        },
        gold: {
          DEFAULT: "#C5A059",
          50: "#FBF6EC",
          100: "#F6EDD8",
          200: "#EDDBB1",
          300: "#E3CA8A",
          400: "#DAB873",
          500: "#C5A059",
          600: "#A0824B",
          700: "#7B663B",
          800: "#56492C",
          900: "#312D1C",
        },
        gov: {
          50: "#E7EBF0",
          100: "#C2CCD9",
          200: "#8497B4",
          300: "#4D6489",
          400: "#1F3C66",
          500: "#0A2540",
          600: "#081E36",
          700: "#06182C",
          800: "#041122",
          900: "#020A18",
        },
      },
      boxShadow: {
        gov: "0 4px 20px rgba(0, 0, 0, 0.05)",
        "gov-lg": "0 8px 30px rgba(10, 37, 64, 0.12)",
      },
    },
  },
  plugins: [],
};
