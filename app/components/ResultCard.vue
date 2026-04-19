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
  <article class="overflow-hidden rounded-3xl border bg-white shadow-report-card" :class="result.borderClass">
    <div class="min-h-48 border-b px-6 py-5" :class="result.surfaceClass">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="mb-2 text-xs font-medium uppercase tracking-widest text-terra">{{ eyebrow }}</p>
          <h2 class="mb-3.5 font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-[2.75rem]">
            <span v-if="titlePrefix">{{ titlePrefix }} </span>{{ result.label }}
          </h2>
        </div>

        <span class="rounded-full px-3 py-1 text-xs text-center font-medium" :class="result.badgeClass">
          {{ result.eyebrow }}
        </span>
      </div>

      <p class="max-w-lg text-[15px] leading-7 text-dark2">
        {{ result.shortSummary }}
      </p>
    </div>

    <div class="px-6 py-6">
      <p class="text-[15px] leading-7 text-body">
        {{ result.longSummary }}
      </p>

      <div v-if="ranking.length" class="mt-6 grid gap-3">
        <div
          v-for="item in ranking"
          :key="item.type"
          class="grid gap-2"
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
