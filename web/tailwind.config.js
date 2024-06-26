import react from "@vitejs/plugin-react-swc";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screen:{
        sm: "640px",
      },
      spacing: {
        '120': '120rem',
        '60': '60rem',
        '4.17': '4.17rem',
      },
      fontFamily: {
        'alibaba': ['Alibaba PuHuiTi 2.0', 'Alibaba PuHuiTi 20', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '4rem',
      },
      colors: {
        'custom-gray': '#1A1A1A',
        'custom-blue': '#0256FF',
      },
    },
  },
  plugins: [react()],
}
