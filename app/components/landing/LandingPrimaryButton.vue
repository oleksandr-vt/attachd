<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href?: string
    label: string
    size?: 'md' | 'lg'
  }>(),
  {
    href: '#',
    size: 'md',
  },
)

const sizeClasses = computed(() =>
  props.size === 'lg'
    ? 'button-size-lg px-9.5 py-4.5'
    : 'button-size-md px-7.5 py-3.5',
)

const isExternal = computed(() =>
  /^(https?:|mailto:|tel:)/.test(props.href),
)
</script>

<template>
  <NuxtLink
    v-if="!isExternal"
    :to="href"
    class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-terra font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk"
    :class="sizeClasses"
  >
    <span>{{ label }}</span>
    <span aria-hidden="true">&rarr;</span>
  </NuxtLink>

  <a
    v-else
    :href="href"
    class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-terra font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk"
    :class="sizeClasses"
  >
    <span>{{ label }}</span>
    <span aria-hidden="true">&rarr;</span>
  </a>
</template>

<style scoped>
.button-size-lg {
  font-size: 17px;
}

.button-size-md {
  font-size: 15px;
}
</style>
