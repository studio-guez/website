// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/style/_main.scss'],
  app: {
    baseURL: '/',
  },
  ssr: false,
  nitro: {
    output: {
      publicDir: 'docs',
    },
  }
})
