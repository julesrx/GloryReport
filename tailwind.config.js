const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        brand: '#c51611',
        gray: {
          '100': '#f5f5f5',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '400': '#bdbdbd',
          '500': '#9e9e9e',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
        },
        xbox: '#107c10',
        playstation: '#003891',
        steam: '#000000',
        stadia: '#e4362e'
      },
      spacing: {
        'char': '96px',
        'char-lg': '474px'
      }
    }
  },
  variants: {},
  plugins: [],
}
