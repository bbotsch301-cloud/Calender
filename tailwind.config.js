/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#12121A',
        surfaceElev: '#1A1A24',
        gold: '#C9A84C',
        goldLight: '#E8C97A',
        goldDark: '#8B7232',
        text: '#F0EDE6',
        textMuted: '#8A8578',
        textDim: '#5A5648',
        border: '#2A2A36',
        passover: '#7C2D12',
        unleavened: '#A16207',
        firstfruits: '#65A30D',
        pentecost: '#0EA5E9',
        trumpets: '#DC2626',
        atonement: '#1E293B',
        tabernacles: '#15803D',
        eighthDay: '#9333EA',
      },
      fontFamily: {
        sans: ['System'],
      },
      letterSpacing: {
        wider: '0.05em',
        widest: '0.15em',
      },
    },
  },
  plugins: [],
};
