/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
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
          DEFAULT: "#002B5B",
          50: "#E6EDF4",
          100: "#BCCBDE",
          200: "#7E9AC0",
          300: "#3F69A2",
          400: "#1A4880",
          500: "#002B5B",
          600: "#00254E",
          700: "#001E41",
          800: "#001834",
          900: "#001127",
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
          50: "#E6EDF4",
          100: "#BCCBDE",
          200: "#7E9AC0",
          300: "#3F69A2",
          400: "#1A4880",
          500: "#002B5B",
          600: "#00254E",
          700: "#001E41",
          800: "#001834",
          900: "#001127",
        },
      },
      boxShadow: {
        gov: "0 4px 20px rgba(0, 0, 0, 0.05)",
        "gov-lg": "0 8px 30px rgba(0, 43, 91, 0.12)",
      },
    },
  },
  plugins: [],
};
