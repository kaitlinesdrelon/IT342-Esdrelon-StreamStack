/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
          light: '#3B82F6',
        },
        secondary: {
          DEFAULT: '#1E3A8A',
          dark: '#1E293B',
          light: '#60A5FA',
        },
        background: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        }
      },
    },
  },
  plugins: [],
}