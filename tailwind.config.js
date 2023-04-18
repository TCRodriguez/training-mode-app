/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'blue': '#023E6F',
      'gray': '#A3A39A',
      'green': '#37981F',
      'yellow': '#F8AF04',
      'red': '#E30000',
      'black': '#0B0B0A'
    },
    extend: {},
  },
  plugins: [],
}
