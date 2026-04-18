import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'CompSurge - FNCS Stats & Leaderboards',
      meta: [
        { name: 'description', content: 'Top Fortnite FNCS Grand Finals stats, placements and earnings leaderboards.' }
      ],
    }
  },
})
