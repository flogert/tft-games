/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Scan these files for Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['var(--font-ysabeau)', 'sans-serif'], // For your local font
      },
      colors: {
        'gaming-dark': '#0f172a', // Slate 900
        'gaming-card': '#1e293b', // Slate 800
        'gaming-accent': '#f59e0b', // Amber 500
        'gaming-secondary': '#0ea5e9', // Sky 500
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(to bottom right, #0f172a, #1e293b)',
      }
    },
  },
  plugins: [],
};

