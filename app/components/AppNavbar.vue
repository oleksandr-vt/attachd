<template>
  <header
    class="fixed inset-x-0 top-0 z-[100] px-8 transition-all duration-300 max-[600px]:px-5"
    :class="isScrolled ? 'bg-[rgba(250,248,244,0.94)] shadow-[0_1px_0_#E4DDD3] backdrop-blur-[10px]' : ''"
  >
    <div class="mx-auto flex h-[68px] max-w-[1160px] items-center gap-8">
      <a href="/" class="shrink-0 font-playfair text-2xl font-normal italic text-dark">
        {{ landingBrandName }}
      </a>

      <nav class="ml-auto flex gap-8 max-[600px]:hidden">
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
        class="shrink-0 rounded-full bg-dark px-5 py-2 text-sm font-medium text-cream transition-colors duration-200 hover:bg-dark2"
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
