/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          purple: {
            400: '#a855f7',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
          }
        }
      },
    },
    plugins: [],
  }