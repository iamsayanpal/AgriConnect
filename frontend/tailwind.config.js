/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retail: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#047857'
        },
        bulk: {
          light: '#eff6ff',
          DEFAULT: '#2563eb',
          dark: '#1d4ed8'
        },
        farmer: {
          light: '#fffbeb',
          DEFAULT: '#d97706',
          dark: '#b45309'
        }
      }
    },
  },
  plugins: [],
}
