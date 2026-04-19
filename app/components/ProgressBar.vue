<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    caption: string
    value: number
    meta?: string
  }>(),
  {
    meta: '',
  },
)

const clampedValue = computed(() => Math.min(Math.max(props.value, 0), 100))
</script>

<template>
  <div>
    <div class="mb-3 flex items-end justify-between gap-4">
      <div>
        <p class="mb-1 text-xs font-medium uppercase tracking-widest text-terra">{{ label }}</p>
        <p class="text-sm font-medium text-dark">{{ caption }}</p>
      </div>

      <div class="text-right">
        <p class="text-sm font-medium text-dark">{{ Math.round(clampedValue) }}%</p>
        <p v-if="meta" class="text-xs text-muted">{{ meta }}</p>
      </div>
    </div>

    <div class="h-2 overflow-hidden rounded-full bg-border">
      <span
        class="block h-full rounded-full bg-linear-to-r from-terra to-terra-soft transition-all duration-300"
        :style="{ width: `${clampedValue}%` }"
      />
    </div>
  </div>
</template>
