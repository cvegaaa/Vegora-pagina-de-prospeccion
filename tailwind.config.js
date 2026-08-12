/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'v-negro': '#0A0A0A',
        'v-carbon': '#171717',
        'v-grafito': '#242424',
        'v-azul': '#2563EB',
        'v-turquesa': '#14B8A6',
        'v-blanco': '#F8FAFC',
        'v-gris': '#94A3B8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
