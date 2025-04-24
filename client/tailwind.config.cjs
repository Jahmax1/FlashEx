/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00D4FF',
        'neon-green': '#39FF14',
        'dark-bg': '#1A1A2E',
        'light-bg': '#F3F4F6',
      },
    },
  },
  plugins: [],
};