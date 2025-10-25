/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hedera: {
          purple: '#9b59b6',
          blue: '#2980b9',
        }
      },
      backgroundImage: {
        'gradient-hedera': 'linear-gradient(135deg, #9b59b6 0%, #2980b9 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      }
    },
  },
  plugins: [],
}
