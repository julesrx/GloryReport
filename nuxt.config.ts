export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,
    css: ['~/assets/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    }
    // resolve: {
    //   alias: [
    //     { find: '~', replacement: '/src' },
    //     { find: 'components', replacement: '/src/components' },
    //     { find: 'views', replacement: '/src/views' }
    //   ]
    // },
});
