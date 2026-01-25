/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Aptos', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      screens: {
        'tablet': '765px', // 764px ve altında hamburger, 765px ve üstünde desktop nav
        'mid': '924px', // 765px-924px arası için optimize edilmiş breakpoint
        'search': '1120px', // 1120px ve üstü için search bar horizontal layout
        'wide': '1800px', // 1800px ve üstü için özel breakpoint
      },
    },
  },
  plugins: [],
}

