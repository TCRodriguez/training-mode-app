/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'blue': '#023E6F',
      'apex-blue': '#181E5B',
      'gray': '#A3A39A',
      'apex-gray': '#E6C900',
      // 'gray': '#A3A49B',
      'green': '#37981F',
      'apex-green': '#00B825',
      'yellow': '#F8AF04',
      'apex-yellow': '#E6C900',
      'red': '#E30000',
      'apex-red': '#D72638',
      'black': '#0B0B0A',
      'white': '#FFFFFC'
    },
    extend: {
      screens: {
        'xs': '375px'
      }
    },
  },
  plugins: [],
}
