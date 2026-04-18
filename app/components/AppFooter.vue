<template>
  <footer class="border-t border-border bg-cream py-10">
    <div class="landing-container flex flex-wrap items-center gap-6 sm:gap-10">
      <a href="/" class="font-playfair text-2xl font-normal italic text-dark">
        {{ landingBrandName }}
      </a>

      <nav class="flex w-full flex-wrap gap-5 sm:ml-auto sm:w-auto sm:gap-7">
        <a
          v-for="link in landingFooterLinks"
          :key="link.label"
          :href="link.href"
          class="text-sm text-muted transition-colors duration-200 hover:text-dark"
        >
          {{ link.label }}
        </a>
      </nav>

      <p class="w-full text-xs leading-[1.6] text-pale">
        &copy; {{ copyrightYear }} Attachd. For educational purposes only - not a substitute for
        professional psychological advice.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { landingBrandName, landingFooterLinks } from '~/data/landing'

const copyrightYear = new Date().getFullYear()
</script>
