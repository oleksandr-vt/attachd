<template>
  <footer class="border-t border-border bg-cream py-10">
    <div class="landing-container flex flex-wrap items-center gap-6 sm:gap-10">
      <NuxtLink to="/" class="font-display text-2xl font-normal italic text-dark">
        {{ landingBrandName }}
      </NuxtLink>

      <nav class="flex w-full flex-wrap gap-5 sm:ml-auto sm:w-auto sm:gap-7">
        <NuxtLink
          v-for="link in landingFooterLinks"
          :key="link.label"
          :to="link.href"
          class="text-sm text-muted transition-colors duration-200 hover:text-dark"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <p class="footer-note w-full text-xs text-pale">
        &copy; {{ copyrightYear }} Attachd. For educational purposes only. This attachment style
        test is not a diagnosis and does not replace therapy, medical care, or professional mental
        health support.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { landingBrandName, landingFooterLinks } from '~/data/landing'

const copyrightYear = new Date().getFullYear()
</script>

<style scoped>
.footer-note {
  line-height: 1.6;
}
</style>
