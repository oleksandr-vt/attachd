<template>
  <header class="fixed inset-x-0 top-0 z-100 border-b border-border bg-cream/95 backdrop-blur-sm transition-all duration-300">
    <div class="landing-container flex h-17 items-center gap-4 sm:gap-6">
      <NuxtLink to="/" class="shrink-0 font-display text-2xl font-normal italic text-dark">
        {{ landingBrandName }}
      </NuxtLink>

      <nav class="hidden items-center gap-8 lg:ml-auto lg:flex">
        <NuxtLink
          v-for="link in landingNavLinks"
          :key="link.label"
          :to="link.href"
          class="text-sm text-muted transition-colors duration-200 hover:text-dark"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <NuxtLink
        :to="primaryActionHref"
        class="ml-auto shrink-0 whitespace-nowrap rounded-full bg-dark px-4 py-2 text-xs font-medium text-cream transition-colors duration-200 hover:bg-dark2 sm:px-5 sm:text-sm lg:ml-0"
      >
        {{ primaryActionLabel }} &rarr;
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAttachmentPrimaryAction } from '~/composables/useAttachmentPrimaryAction'
import { landingBrandName, landingNavLinks } from '~/data/landing'

const { href: primaryActionHref, label: primaryActionLabel } = useAttachmentPrimaryAction()
</script>
