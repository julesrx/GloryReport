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
        lime: '#99ff00',
        oyster: {
          '100': '#fefefe',
          '200': '#fdfdfd',
          '300': '#fcfcfc',
          '400': '#f9f9f9',
          '500': '#f7f7f7',
          '600': '#dedede',
          '700': '#949494',
          '800': '#6f6f6f',
          '900': '#4a4a4a'
        },
        bungie: {
          'red': '#c94340',
          'blue': '#1a9ee8',
          'yellow': '#ffce3e'
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
