/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/containers/**/*.{js,ts,jsx,tsx}',
    './src/common/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundColor: {
        branding01: '#00FFEC',
        branding05: '#001211',
        branding07: '#003A3B'
      },
      colors: {
        branding01: '#00FFEC',
        neutral02: 'rgba(255, 255, 255, 0.5)',
        neutral07: '#1F1E1E'
      },
      height: {
        82: '22rem' /** 350px */
      }
    }
  },
  plugins: []
}
