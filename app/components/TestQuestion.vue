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
  <article class="question-card border border-border bg-white shadow-report-card">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div class="max-w-140">
        <p class="question-kicker">
          Question {{ questionNumber }} of {{ totalQuestions }}
        </p>
        <h2 class="question-title">
          {{ question.prompt }}
        </h2>
      </div>

      <span class="question-note">
        Choose what feels most true on average
      </span>
    </div>

    <div class="grid gap-3">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="question-option text-left transition-all duration-200"
        :class="selectedValue === option.value ? 'question-option-active' : 'question-option-idle'"
        @click="$emit('select', option.value)"
      >
        <span class="question-option-number">
          {{ option.value + 1 }}
        </span>

        <span class="min-w-0 flex-1">
          <span class="question-option-label">{{ option.label }}</span>
          <span class="question-option-hint">{{ option.hint }}</span>
        </span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.question-card {
  border-radius: 24px;
  padding: 1.75rem;
}

.question-kicker {
  color: var(--color-terra);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 0.625rem;
  text-transform: uppercase;
}

.question-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 2.35rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.12;
}

.question-note {
  background-color: var(--color-sec-bg);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted);
  font-size: 12px;
  padding: 0.5rem 0.875rem;
  white-space: nowrap;
}

.question-option {
  align-items: center;
  border-radius: 20px;
  display: flex;
  gap: 1rem;
  padding: 1rem 1.1rem;
  width: 100%;
}

.question-option-idle {
  background-color: var(--color-cream);
  border: 1px solid var(--color-border);
}

.question-option-idle:hover {
  border-color: #d9cfc3;
  transform: translateY(-1px);
}

.question-option-active {
  background-color: var(--color-sec-bg);
  border: 1px solid #d9cfc3;
  box-shadow: 0 10px 24px rgba(28, 23, 18, 0.06);
  transform: translateY(-1px);
}

.question-option-number {
  align-items: center;
  background-color: rgb(255 255 255 / 80%);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-dark);
  display: inline-flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  height: 2.25rem;
  justify-content: center;
  width: 2.25rem;
}

.question-option-label,
.question-option-hint {
  display: block;
}

.question-option-label {
  color: var(--color-dark);
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
}

.question-option-hint {
  color: var(--color-muted);
  font-size: 13px;
}

@media (min-width: 40rem) {
  .question-card {
    padding: 2rem;
  }
}
</style>
