// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@nuxt/icon'],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    },
  },
  runtimeConfig: {
    public: {
      backend: process.env.BACKEND,
    }
  },
  app: {
    head: {
      title: 'Numerology',
      link: [
        {
          rel: 'icon',
          href: '/logo.png',
        },
        {
          rel: 'stylesheet',
          href: '/helpers.css',
        },
        {
          rel: 'stylesheet',
          href: '/style.css',
        },
      ],
    },
  },
});
