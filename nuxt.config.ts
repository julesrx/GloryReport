const title = 'Glory.report';
const description = 'Destiny 2 PvP tools, including player encounters, daily reports, and more';
const url = 'https://glory.report/';

export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,
    css: ['@fontsource-variable/inter/index.css', '~/assets/main.css'],
    modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/eslint-module', '@nuxt/icon'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    eslint: { fix: true, failOnError: true },
    typescript: {
        typeCheck: false, // TODO: switch back to true => https://github.com/nuxt-modules/icon/issues/117
        strict: true
    },
    appConfig: { title },
    app: {
        head: {
            htmlAttrs: { lang: 'en' },
            bodyAttrs: { class: 'bg-black text-white' },
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
