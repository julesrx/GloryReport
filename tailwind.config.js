// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.html', './src/**/*.vue']
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        brand: '#c51611',
        dark: {
          50: '#F3F3F3',
          100: '#E7E7E7',
          200: '#C4C4C4',
          300: '#A0A0A0',
          400: '#595959',
          500: '#121212',
          600: '#101010',
          700: '#0B0B0B',
          800: '#080808',
          900: '#050505'
        },
        light: {
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FEFEFE',
          300: '#FDFDFD',
          400: '#FCFCFC',
          500: '#FAFAFA',
          600: '#E1E1E1',
          700: '#969696',
          800: '#717171',
          900: '#4B4B4B'
        }
      }
    }
  },
  variants: {},
  plugins: [],
  future: {
    purgeLayersByDefault: true
  }
};
