module.exports = {
  theme: {
    fontFamily: {
      'sans': ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        main: '#c51611',
        gray: { // replaced the default cool grays with a neutral gray palette
          '100': '#f5f5f5',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '400': '#bdbdbd',
          '500': '#9e9e9e',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
        }
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
