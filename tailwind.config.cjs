/** @type {import('tailwindcss').Config} */
const { extend } = require("tailwindcss");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      colors: {
        black: "#000112",
        darkBG: "#20212C",
        darkGrey: "#2B2C37",
        lines: "#3E3F4E",
        mediumGrey: "#828FA3",
        white: "#FFFFFF",
        mainPurple: "#635FC7",
        mainPurpleHover: "#A8A4FF",
        red: "#EA5555",
        redHover: "#FF9898",
        linesLight: "#E4EBFA",
        linesGrey: "#F4F7FD",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
