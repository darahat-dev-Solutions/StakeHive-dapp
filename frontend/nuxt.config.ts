// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: true,

  nitro: {
    preset: "netlify",
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },
  routeRules: {
    // Add this for SPA fallback
    "/**": { ssr: false },
  },
  app: {
    head: {
      script: [
        {
          src: "https://cdn.tailwindcss.com",
          tagPosition: "head",
        },
      ],
    },
  },
  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  piniaPersistedstate: {
    storage: "localStorage",
  },
});
