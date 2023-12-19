import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
        './nuxt.config.ts'
    ],
    theme: {
        extend: {
            colors: {
                black: { DEFAULT: 'rgb(0, 0, 0)', muted: 'rgb(16, 16, 16)' },
                white: { DEFAULT: 'rgb(250, 250, 250)', muted: 'rgba(250, 250, 250, 0.70)' }
            },
            fontFamily: {
                sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans]
            }
        }
    },
    plugins: []
};
