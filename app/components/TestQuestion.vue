<script setup lang="ts">
import type { AttachmentAnswerOption, AttachmentQuestion } from '~/data/tests/attachment'

defineProps<{
  question: AttachmentQuestion
  questionNumber: number
  totalQuestions: number
  selectedValue: number | null
  options: AttachmentAnswerOption[]
}>()

defineEmits<{
  select: [value: number]
}>()
</script>

<template>
  <article class="rounded-3xl border border-border bg-white p-7 shadow-report-card sm:p-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div class="max-w-140">
        <p class="mb-2.5 text-xs font-medium uppercase tracking-widest text-terra">
          Question {{ questionNumber }} of {{ totalQuestions }}
        </p>
        <h2 class="font-display text-3xl leading-tight font-medium tracking-tight text-dark sm:text-4xl lg:text-[2.35rem]">
          {{ question.prompt }}
        </h2>
      </div>

      <span class="rounded-full border border-border bg-sec-bg px-3.5 py-2 text-xs text-muted">
        Choose what feels most true on average
      </span>
    </div>

    <div class="grid gap-3">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="flex w-full items-center gap-4 rounded-2xl border px-4.5 py-4 text-left transition-all duration-200"
        :class="selectedValue === option.value
          ? 'border-soft-muted bg-sec-bg shadow-[0_10px_24px_rgba(28,23,18,0.06)]'
          : 'border-border bg-cream hover:-translate-y-px hover:border-[#d9cfc3]'"
        @click.stop="$emit('select', option.value)"
      >
        <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white/80 text-[13px] font-medium text-dark">
          {{ option.value + 1 }}
        </span>

        <span class="min-w-0 flex-1">
          <span class="mb-0.5 block text-[15px] font-medium text-dark">{{ option.label }}</span>
          <span class="block text-[13px] text-muted">{{ option.hint }}</span>
        </span>
      </button>
    </div>
  </article>
</template>
