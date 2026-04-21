<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    href?: string
    label?: string
    variant?: 'primary' | 'secondary' | 'outline' | 'tertiary'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    showArrow?: boolean
  }>(),
  {
    href: '',
    label: '',
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    showArrow: false,
  },
)

const attrs = useAttrs()

const isExternal = computed(() =>
  /^(https?:|mailto:|tel:)/.test(props.href),
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-5 py-3 text-sm'
    case 'lg':
      return 'px-9 py-4.5 text-[17px]'
    default:
      return 'px-7 py-3.5 text-[15px]'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border border-border bg-sec-bg text-dark hover:-translate-y-px hover:border-soft-muted hover:bg-white'
    case 'outline':
      return 'border border-border bg-white text-dark hover:-translate-y-px hover:border-soft-muted'
    case 'tertiary':
      return 'border border-border bg-white text-muted hover:-translate-y-px hover:border-soft-muted hover:text-dark'
    default:
      return 'bg-terra text-cream hover:-translate-y-px hover:bg-terra-dk'
  }
})

const rootClasses = computed(() => [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200',
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0',
  props.disabled ? 'pointer-events-none opacity-55' : '',
  sizeClasses.value,
  variantClasses.value,
])
</script>

<template>
  <NuxtLink
    v-if="href && !isExternal"
    :to="href"
    :class="rootClasses"
    :aria-disabled="disabled || undefined"
    v-bind="attrs"
  >
    <span><slot>{{ label }}</slot></span>
    <span v-if="showArrow" aria-hidden="true">&rarr;</span>
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    :class="rootClasses"
    :aria-disabled="disabled || undefined"
    v-bind="attrs"
  >
    <span><slot>{{ label }}</slot></span>
    <span v-if="showArrow" aria-hidden="true">&rarr;</span>
  </a>

  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="rootClasses"
    v-bind="attrs"
  >
    <span><slot>{{ label }}</slot></span>
    <span v-if="showArrow" aria-hidden="true">&rarr;</span>
  </button>
</template>
