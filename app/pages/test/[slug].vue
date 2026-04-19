<script setup lang="ts">
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
import ProgressBar from '~/components/ProgressBar.vue'
import TestQuestion from '~/components/TestQuestion.vue'
import { attachmentResults } from '~/data/tests/results'
import { useTest } from '~/composables/useTest'

const route = useRoute()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

if (slugParam !== 'attachment') {
  throw createError({
    statusCode: 404,
    statusMessage: 'Test not found',
  })
}

const {
  attachmentTest,
  answeredCount,
  computedResult,
  currentAnswer,
  currentQuestion,
  currentQuestionNumber,
  estimatedMinutesLeft,
  goToNextQuestion,
  goToPreviousQuestion,
  hasStarted,
  isComplete,
  progressPercentage,
  remainingQuestions,
  resetTest,
  setAnswer,
  totalQuestions,
  completeTest,
  startTest,
} = useTest('attachment')

const requestUrl = useRequestURL()
const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`

const beginLabel = computed(() =>
  answeredCount.value > 0 ? `Resume at question ${currentQuestionNumber.value}` : 'Start the test',
)

const progressCaption = computed(() =>
  isComplete.value
    ? `All ${totalQuestions} questions answered`
    : hasStarted.value
      ? `Question ${currentQuestionNumber.value} of ${totalQuestions}`
      : `25 questions - about ${attachmentTest.estimatedMinutes} minutes`,
)

const progressMeta = computed(() =>
  isComplete.value
    ? 'Result ready'
    : hasStarted.value
      ? `${remainingQuestions.value} left - about ${estimatedMinutesLeft.value} min`
      : 'No account needed',
)

const continueLabel = computed(() =>
  currentQuestionNumber.value === totalQuestions ? 'See my result' : 'Next question',
)

const handleSelect = (value: number) => {
  setAnswer(currentQuestion.value.id, value)
}

const handleContinue = async () => {
  if (currentAnswer.value === null) {
    return
  }

  if (currentQuestionNumber.value === totalQuestions) {
    const result = completeTest()

    if (result) {
      await navigateTo(`/results/${result.type}`)
    }

    return
  }

  goToNextQuestion()
}

const handleRestart = () => {
  resetTest()
  startTest()
}

const handleViewResult = async () => {
  if (!computedResult.value) {
    return
  }

  await navigateTo(`/results/${computedResult.value.type}`)
}

useSeoMeta({
  title: 'Attachment Style Test',
  description:
    'Take the 25-question attachment style test to see whether your relationship pattern is secure, anxious, avoidant, or fearful-avoidant.',
  ogTitle: 'Attachment Style Test | Attachd.',
  ogDescription:
    'A fast 25-question attachment style test with a clear result and a polished follow-up results flow.',
  twitterCard: 'summary',
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
})
</script>

<template>
  <section class="landing-section bg-cream">
    <div class="landing-container">
      <div class="test-layout">
        <aside class="test-sidebar">
          <div class="test-sidebar-card border border-border bg-sec-bg">
            <p class="landing-section-kicker">Attachment style test</p>
            <h1 class="test-title">
              Read the pattern behind how you do closeness.
            </h1>
            <p class="landing-section-copy">
              Move quickly, answer honestly, and lean on your first instinct. This first version is
              structured so the later email gate and deeper report can plug straight into the same
              flow.
            </p>

            <div class="mt-8 grid gap-3">
              <div class="test-sidebar-stat border border-border bg-white">
                <span class="test-sidebar-label">Length</span>
                <strong class="test-sidebar-value">25 questions</strong>
              </div>
              <div class="test-sidebar-stat border border-border bg-white">
                <span class="test-sidebar-label">Time</span>
                <strong class="test-sidebar-value">About 4 minutes</strong>
              </div>
              <div class="test-sidebar-stat border border-border bg-white">
                <span class="test-sidebar-label">Result</span>
                <strong class="test-sidebar-value">4 attachment styles</strong>
              </div>
            </div>

            <div class="mt-8 grid gap-2">
              <p class="test-chip-row-label">Styles you may see</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="result in attachmentResults"
                  :key="result.type"
                  class="rounded-full px-3 py-1 text-xs font-medium"
                  :class="result.badgeClass"
                >
                  {{ result.label }}
                </span>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <LandingPrimaryButton :href="'/#hero'" label="Back to landing" />
            </div>
          </div>
        </aside>

        <div class="min-w-0">
          <div class="test-shell border border-border bg-white shadow-report-card">
            <ProgressBar
              label="Progress"
              :caption="progressCaption"
              :meta="progressMeta"
              :value="hasStarted ? progressPercentage : 0"
            />

            <Transition name="test-panel" mode="out-in">
              <div v-if="!hasStarted" key="intro" class="test-intro">
                <div class="test-intro-card border border-border bg-sec-bg">
                  <p class="test-intro-kicker">Before you begin</p>
                  <h2 class="test-intro-title">Answer for your usual relationship pattern, not your ideal one.</h2>
                  <p class="test-intro-copy">
                    Think about romantic relationships or the closest equivalent in your life.
                    Focus on what tends to happen when closeness, reassurance, conflict, or space become emotionally charged.
                  </p>

                  <ul class="mt-6 grid gap-3">
                    <li class="test-intro-point border border-border bg-white">
                      Choose the option that feels truest most of the time.
                    </li>
                    <li class="test-intro-point border border-border bg-white">
                      You can move back and revise earlier answers before finishing.
                    </li>
                    <li class="test-intro-point border border-border bg-white">
                      The result is educational, not diagnostic.
                    </li>
                  </ul>

                  <div class="mt-8 flex flex-wrap items-center gap-4">
                    <button type="button" class="test-primary-button" @click="startTest()">
                      {{ beginLabel }}
                    </button>
                    <span class="landing-action-note">No signup required to start</span>
                  </div>
                </div>
              </div>

              <div v-else-if="isComplete && computedResult" key="complete" class="test-intro">
                <div class="test-intro-card border border-border bg-sec-bg">
                  <p class="test-intro-kicker">Result ready</p>
                  <h2 class="test-intro-title">Your answers are complete.</h2>
                  <p class="test-intro-copy">
                    You can go straight to your attachment result or restart the full 25-question flow if you want a fresh pass.
                  </p>

                  <div class="mt-8 flex flex-wrap items-center gap-4">
                    <button type="button" class="test-primary-button" @click="handleViewResult">
                      View my result
                    </button>
                    <button type="button" class="test-secondary-button" @click="handleRestart">
                      Retake the test
                    </button>
                  </div>
                </div>
              </div>

              <div v-else :key="currentQuestion.id" class="test-runner">
                <TestQuestion
                  :question="currentQuestion"
                  :question-number="currentQuestionNumber"
                  :total-questions="totalQuestions"
                  :selected-value="currentAnswer"
                  :options="attachmentTest.options"
                  @select="handleSelect"
                />

                <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div class="flex flex-wrap gap-3">
                    <button
                      type="button"
                      class="test-secondary-button"
                      :disabled="currentQuestionNumber === 1"
                      @click="goToPreviousQuestion"
                    >
                      Back
                    </button>
                    <button type="button" class="test-tertiary-button" @click="handleRestart">
                      Restart
                    </button>
                  </div>

                  <div class="flex flex-wrap items-center gap-4">
                    <span class="landing-action-note" v-if="currentAnswer === null">
                      Pick one answer to continue
                    </span>

                    <button
                      type="button"
                      class="test-primary-button"
                      :disabled="currentAnswer === null"
                      @click="handleContinue"
                    >
                      {{ continueLabel }}
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.test-layout {
  display: grid;
  gap: 2rem;
}

.test-sidebar-card,
.test-shell,
.test-intro-card,
.test-intro-point,
.test-sidebar-stat {
  border-radius: 24px;
}

.test-sidebar-card,
.test-shell {
  padding: 1.5rem;
}

.test-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: clamp(2.15rem, 4vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
}

.test-sidebar-stat {
  padding: 1rem 1.05rem;
}

.test-sidebar-label,
.test-chip-row-label,
.test-intro-kicker {
  color: var(--color-terra);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.test-sidebar-label {
  display: block;
  margin-bottom: 0.375rem;
}

.test-sidebar-value {
  color: var(--color-dark);
  font-size: 15px;
  font-weight: 500;
}

.test-shell {
  min-height: 38rem;
}

.test-intro {
  padding-top: 1.5rem;
}

.test-intro-card {
  padding: 1.75rem;
}

.test-intro-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.5vw, 2.55rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-top: 0.75rem;
}

.test-intro-copy {
  color: var(--color-body);
  font-size: 15px;
  line-height: 1.75;
  margin-top: 0.875rem;
  max-width: 38rem;
}

.test-intro-point {
  color: var(--color-dark2);
  font-size: 15px;
  line-height: 1.65;
  padding: 1rem 1.05rem;
}

.test-primary-button,
.test-secondary-button,
.test-tertiary-button {
  border-radius: 999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  padding: 0.95rem 1.4rem;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
}

.test-primary-button {
  background-color: var(--color-terra);
  color: var(--color-cream);
}

.test-primary-button:hover:not(:disabled) {
  background-color: var(--color-terra-dk);
  transform: translateY(-1px);
}

.test-primary-button:disabled,
.test-secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}

.test-secondary-button,
.test-tertiary-button {
  background-color: var(--color-sec-bg);
  border: 1px solid var(--color-border);
  color: var(--color-dark);
}

.test-secondary-button:hover:not(:disabled),
.test-tertiary-button:hover {
  border-color: #d0c4b7;
  transform: translateY(-1px);
}

.test-panel-enter-active,
.test-panel-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.test-panel-enter-from,
.test-panel-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (min-width: 64rem) {
  .test-layout {
    grid-template-columns: minmax(0, 19rem) minmax(0, 1fr);
  }

  .test-sidebar {
    position: sticky;
    top: 6.5rem;
    align-self: start;
  }

  .test-sidebar-card,
  .test-shell {
    padding: 1.75rem;
  }
}
</style>
