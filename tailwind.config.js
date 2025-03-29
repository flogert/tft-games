/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Scan these files for Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Ysabeau SC', 'sans-serif'], // For your local font
      },
    },
  },
  plugins: [],
};

