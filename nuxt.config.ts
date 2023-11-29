const title = 'Glory.report';
const description = '';
const url = 'https://glory.report/';

export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,
    css: ['~/assets/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    typescript: { typeCheck: true, strict: true },
    appConfig: { title },
    app: {
        head: {
            htmlAttrs: { lang: 'en' },
            title,
            meta: [
                { name: 'title', content: title },
                { name: 'description', content: description },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },

                // Twitter
                { name: 'twitter:card', content: 'summary' },
                { name: 'twitter:title', content: title },
                { name: 'twitter:description', content: description },
                { name: 'twitter:image', content: url + 'summary.png' },

                // Open Graph / Facebook
                { name: 'og:title', content: title },
                { name: 'og:type', content: 'website' },
                { name: 'og:image', content: url + 'summary.png' },
                { name: 'og:url', content: url },
                { name: 'og:description', content: description }
            ],
            link: [
                { rel: 'canonical', href: url },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }
            ]
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
