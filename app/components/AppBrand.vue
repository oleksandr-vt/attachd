<template>
  <NuxtLink to="/" :aria-label="landingBrandName" class="shrink-0 select-none font-display text-2xl font-normal italic text-dark">
    <span class="pointer-events-none block">{{ landingBrandName }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { landingBrandName } from '~/data/landing'
</script>
