/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // "class" permite trocar o tema manualmente (claro/escuro) pelo app
  darkMode: 'class',
  theme: {
    extend: {
      // Cores tiradas da logo do Pixie (manter igual a src/tema/cores.ts)
      colors: {
        roxo: {
          DEFAULT: '#221272',
          claro: '#3A2C8F',
          escuro: '#120A3D',
        },
        creme: '#FCF2E8',
        lilas: {
          DEFAULT: '#D19FFC',
          claro: '#EEDDFE',
        },
        suave: '#6B6497',
      },
    },
  },
  plugins: [],
};
