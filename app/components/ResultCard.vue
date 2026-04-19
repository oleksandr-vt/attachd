<script setup lang="ts">
import type { AttachmentRankingItem } from '~/composables/useResults'
import type { AttachmentResultContent } from '~/data/tests/results'

withDefaults(
  defineProps<{
    result: AttachmentResultContent
    ranking?: AttachmentRankingItem[]
    eyebrow?: string
    titlePrefix?: string
  }>(),
  {
    ranking: () => [],
    eyebrow: 'Your attachment result',
    titlePrefix: '',
  },
)
</script>

<template>
  <article class="result-card overflow-hidden border bg-white shadow-report-card" :class="result.borderClass">
    <div class="result-card-head border-b px-6 py-5" :class="result.surfaceClass">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="result-kicker">{{ eyebrow }}</p>
          <h2 class="result-title">
            <span v-if="titlePrefix">{{ titlePrefix }} </span>{{ result.label }}
          </h2>
        </div>

        <span class="rounded-full px-3 py-1 text-xs font-medium" :class="result.badgeClass">
          {{ result.eyebrow }}
        </span>
      </div>

      <p class="result-summary">
        {{ result.shortSummary }}
      </p>
    </div>

    <div class="px-6 py-6">
      <p class="result-copy">
        {{ result.longSummary }}
      </p>

      <div v-if="ranking.length" class="mt-6 grid gap-3">
        <div
          v-for="item in ranking"
          :key="item.type"
          class="result-score-row"
        >
          <div class="mb-2 flex items-center justify-between gap-3">
            <span class="text-sm font-medium text-dark">{{ item.label }}</span>
            <span class="text-sm font-medium" :class="item.accentClass">{{ item.percentage }}%</span>
          </div>

          <div class="h-2 overflow-hidden rounded-full bg-bar-bg">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="item.barClass"
              :style="{ width: `${item.percentage}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.result-card {
  border-radius: 24px;
}

.result-card-head {
  min-height: 12rem;
}

.result-kicker {
  color: var(--color-terra);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.result-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin-bottom: 0.875rem;
}

.result-summary {
  color: var(--color-dark2);
  font-size: 15px;
  line-height: 1.65;
  max-width: 32rem;
}

.result-copy {
  color: var(--color-body);
  font-size: 15px;
  line-height: 1.75;
}
</style>
