/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cafe-orange': '#FF9D23',
        'cafe-teal-start': '#00E0C3',
        'cafe-teal-end': '#00F7FF',
        'cafe-purple': '#8230FF',
        'cafe-dark-purple': '#3A1D64',
      },
      fontFamily: {
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'noto': ['"Noto Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'cafe-bg': 'url("https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        'teal-gradient': 'linear-gradient(to right, #00E0C3, #00F7FF)',
        'purple-orange-gradient': 'linear-gradient(135deg, #8230FF, #FF9D23)',
      }
    },
  },
  plugins: [],
}