<template>
  <header
    class="fixed inset-x-0 top-0 z-[100] transition-all duration-300"
    :class="isScrolled ? 'bg-[rgba(250,248,244,0.94)] shadow-[0_1px_0_#E4DDD3] backdrop-blur-[10px]' : ''"
  >
    <div class="landing-container flex h-[68px] items-center gap-4 sm:gap-6">
      <a href="/" class="shrink-0 font-playfair text-2xl font-normal italic text-dark">
        {{ landingBrandName }}
      </a>

      <nav class="hidden items-center gap-8 lg:ml-auto lg:flex">
        <a
          v-for="link in landingNavLinks"
          :key="link.label"
          :href="link.href"
          class="text-sm text-muted transition-colors duration-200 hover:text-dark"
        >
          {{ link.label }}
        </a>
      </nav>

      <a
        :href="landingPrimaryActionHref"
        class="ml-auto shrink-0 whitespace-nowrap rounded-full bg-dark px-4 py-2 text-[0.8125rem] font-medium text-cream transition-colors duration-200 hover:bg-dark2 sm:px-5 sm:text-sm lg:ml-0"
      >
        Start free test &rarr;
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { landingBrandName, landingNavLinks, landingPrimaryActionHref } from '~/data/landing'

const isScrolled = ref(false)

const syncScrollState = () => {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => {
  syncScrollState()
  window.addEventListener('scroll', syncScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncScrollState)
})
</script>
