// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./public/**/*.html', './src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        dark: '#121212',
        light: '#fafafa'
      }
    }
  },
  variants: {},
  plugins: []
};
