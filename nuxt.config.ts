import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      routes: [
        '/test/attachment',
        '/results/secure',
        '/results/anxious',
        '/results/avoidant',
        '/results/fearful-avoidant',
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Attachd.',
      titleTemplate: '%s | Attachd.',
      meta: [
        {
          name: 'description',
          content: 'Take a 25-question attachment style test to learn whether your relationship pattern is secure, anxious, avoidant, or fearful-avoidant.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap',
        },
      ],
    }
  },
})
