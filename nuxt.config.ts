const title = 'Glory.report';
const description = 'Destiny 2 PvP tools, including player encounters, daily reports, and more';
const url = 'https://glory.report/';

export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,
    css: ['~/assets/main.css'],
    modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/eslint-module'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    eslint: { fix: true },
    typescript: { typeCheck: true, strict: true },
    appConfig: { title },
    app: {
        head: {
            htmlAttrs: { lang: 'en' },
            bodyAttrs: { class: 'bg-stone-900 text-stone-100' },
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
});
