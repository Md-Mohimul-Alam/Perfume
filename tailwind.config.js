/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 20s infinite ease-in-out',
        'shine': 'shine 3s infinite',
        'liquid': 'liquid 8s infinite ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      skew: {
        '20': '20deg',
      }
    },
  },
  plugins: [],
}