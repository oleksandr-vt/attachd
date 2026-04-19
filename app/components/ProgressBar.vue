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
  <div class="progress-shell">
    <div class="mb-3 flex items-end justify-between gap-4">
      <div>
        <p class="progress-label">{{ label }}</p>
        <p class="progress-caption">{{ caption }}</p>
      </div>

      <div class="text-right">
        <p class="progress-percent">{{ Math.round(clampedValue) }}%</p>
        <p v-if="meta" class="progress-meta">{{ meta }}</p>
      </div>
    </div>

    <div class="progress-track">
      <span class="progress-fill" :style="{ width: `${clampedValue}%` }" />
    </div>
  </div>
</template>

<style scoped>
.progress-label {
  color: var(--color-terra);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.progress-caption {
  color: var(--color-dark);
  font-size: 0.9375rem;
  font-weight: 500;
}

.progress-percent {
  color: var(--color-dark);
  font-size: 0.9375rem;
  font-weight: 500;
}

.progress-meta {
  color: var(--color-muted);
  font-size: 12px;
}

.progress-track {
  background-color: var(--color-border);
  border-radius: 999px;
  height: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, var(--color-terra), var(--color-terra-soft));
  border-radius: 999px;
  display: block;
  height: 100%;
  transition: width 0.35s ease;
}
</style>
