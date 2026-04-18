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
    ? 'px-[2.375rem] py-[1.125rem] text-[1.0625rem]'
    : 'px-[1.875rem] py-[0.9rem] text-[0.9375rem]',
)
</script>

<template>
  <a
    :href="href"
    class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-terra font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk"
    :class="sizeClasses"
  >
    <span>{{ label }}</span>
    <span aria-hidden="true">&rarr;</span>
  </a>
</template>
