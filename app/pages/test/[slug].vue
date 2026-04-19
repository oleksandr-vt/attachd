<script setup lang="ts">
import ConfirmDialog from '~/components/ConfirmDialog.vue'
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
  hasSubmittedResults,
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
const showRestartConfirm = ref(false)
const continueLocked = ref(false)
let continueUnlockTimeout: ReturnType<typeof window.setTimeout> | null = null

const beginLabel = computed(() =>
  answeredCount.value > 0 ? `Resume at question ${currentQuestionNumber.value}` : 'Start the test',
)

const progressCaption = computed(() =>
  hasSubmittedResults.value
    ? `All ${totalQuestions} questions answered`
    : hasStarted.value
      ? `Question ${currentQuestionNumber.value} of ${totalQuestions}`
      : `25 questions - about ${attachmentTest.estimatedMinutes} minutes`,
)

const progressMeta = computed(() =>
  hasSubmittedResults.value
    ? 'Results ready'
    : hasStarted.value
      ? `${remainingQuestions.value} left - about ${estimatedMinutesLeft.value} min`
      : 'No account needed',
)

const continueLabel = computed(() =>
  currentQuestionNumber.value === totalQuestions ? 'See my results' : 'Next question',
)

const primaryButtonClass =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full bg-terra px-6 py-4 text-sm font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0'

const secondaryButtonClass =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-sec-bg px-6 py-4 text-sm font-medium text-dark transition-all duration-200 hover:-translate-y-px hover:border-soft-muted hover:bg-white disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0'

const tertiaryButtonClass =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-white px-6 py-4 text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-px hover:border-soft-muted hover:text-dark'

const canContinue = computed(() =>
  currentAnswer.value !== null && !continueLocked.value,
)

const lockContinue = () => {
  continueLocked.value = true

  if (import.meta.client) {
    if (continueUnlockTimeout) {
      window.clearTimeout(continueUnlockTimeout)
    }

    continueUnlockTimeout = window.setTimeout(() => {
      continueLocked.value = false
      continueUnlockTimeout = null
    }, 180)
  } else {
    continueLocked.value = false
  }
}

const handleSelect = (value: number) => {
  lockContinue()
  setAnswer(currentQuestion.value.id, value)
}

const handleContinue = async () => {
  if (!canContinue.value) {
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

const openRestartConfirm = () => {
  showRestartConfirm.value = true
}

const confirmRestart = () => {
  showRestartConfirm.value = false
  continueLocked.value = false

  if (continueUnlockTimeout) {
    window.clearTimeout(continueUnlockTimeout)
    continueUnlockTimeout = null
  }

  resetTest()
}

const handleViewResult = async () => {
  if (!computedResult.value) {
    return
  }

  await navigateTo(`/results/${computedResult.value.type}`)
}

onBeforeUnmount(() => {
  if (continueUnlockTimeout) {
    window.clearTimeout(continueUnlockTimeout)
  }
})

useSeoMeta({
  title: 'Attachment Style Test',
  description:
    'Take the 25-question attachment style test to see whether your relationship pattern is secure, anxious, avoidant, or fearful-avoidant and get clear results.',
  ogTitle: 'Attachment Style Test | Attachd.',
  ogDescription:
    'A fast 25-question attachment style test with clear results and a polished follow-up flow.',
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
      <div class="grid gap-8">
        <div
          v-if="!hasStarted"
          class="rounded-3xl border border-border bg-sec-bg p-6 shadow-report-card md:p-8"
        >
          <div class="grid gap-8 xl:grid-cols-2 xl:items-start">
            <div class="max-w-170">
              <p class="landing-section-kicker">Attachment style test</p>
              <h1 class="landing-section-title">
                Read the pattern behind how you do closeness.
              </h1>
              <p class="landing-section-copy max-w-150">
                Move quickly, answer honestly, and lean on your first instinct. This flow is
                structured so the email gate, deeper report, and next paid steps can plug into the
                same experience without redesigning it later.
              </p>

              <p class="mt-8 text-sm text-muted">
                25 questions, about four minutes, four attachment styles.
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div class="rounded-3xl border border-border bg-white p-4">
                <span class="landing-section-kicker mb-1.5">Length</span>
                <strong class="block text-sm font-medium text-dark">25 questions</strong>
              </div>
              <div class="rounded-3xl border border-border bg-white p-4">
                <span class="landing-section-kicker mb-1.5">Time</span>
                <strong class="block text-sm font-medium text-dark">About 4 minutes</strong>
              </div>
              <div class="rounded-3xl border border-border bg-white p-4">
                <span class="landing-section-kicker mb-1.5">Results</span>
                <strong class="block text-sm font-medium text-dark">4 attachment styles</strong>
              </div>
              <div class="rounded-3xl border border-border bg-white p-4 sm:col-span-3 lg:col-span-1">
                <p class="landing-section-kicker mb-3">Styles you may see</p>
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
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-border bg-white p-6 shadow-report-card md:p-8">
          <ProgressBar
            class="mb-8"
            label="Progress"
            :caption="progressCaption"
            :meta="progressMeta"
            :value="hasStarted ? progressPercentage : 0"
          />

          <Transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-3 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-3 opacity-0"
          >
            <div
              v-if="!hasStarted"
              key="intro"
              class="rounded-3xl border border-border bg-sec-bg p-6 md:p-8"
            >
              <p class="landing-section-kicker">Before you begin</p>
              <h2 class="max-w-120 font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
                Answer for your usual relationship pattern, not your ideal one.
              </h2>
              <p class="landing-section-copy mt-4 max-w-140">
                Think about romantic relationships or the closest equivalent in your life. Focus on
                what tends to happen when closeness, reassurance, conflict, or space become
                emotionally charged.
              </p>

              <ul class="mt-6 grid gap-3">
                <li class="rounded-3xl border border-border bg-white px-4 py-4 text-sm leading-7 text-dark2">
                  Choose the option that feels truest most of the time.
                </li>
                <li class="rounded-3xl border border-border bg-white px-4 py-4 text-sm leading-7 text-dark2">
                  You can move back and revise earlier answers before finishing.
                </li>
                <li class="rounded-3xl border border-border bg-white px-4 py-4 text-sm leading-7 text-dark2">
                  The results are educational, not diagnostic.
                </li>
              </ul>

              <div class="mt-8 flex flex-wrap items-center gap-4">
                <button type="button" :class="primaryButtonClass" @click="startTest()">
                  {{ beginLabel }}
                </button>
                <span class="text-sm text-muted">No signup required to start</span>
              </div>
            </div>

            <div
              v-else-if="hasSubmittedResults && computedResult"
              key="complete"
              class="rounded-3xl border border-border bg-sec-bg p-6 md:p-8"
            >
              <p class="landing-section-kicker">Results ready</p>
              <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
                Your answers are complete.
              </h2>
              <p class="landing-section-copy mt-4 max-w-140">
                You can go straight to your attachment results or restart the full 25-question flow
                if you want a fresh pass.
              </p>

              <div class="mt-8 flex flex-wrap items-center gap-4">
                <button type="button" :class="primaryButtonClass" @click="handleViewResult">
                  View my results
                </button>
                <button type="button" :class="secondaryButtonClass" @click="openRestartConfirm">
                  Retake the test
                </button>
              </div>
            </div>

            <div v-else :key="currentQuestion.id" class="space-y-6">
              <TestQuestion
                :question="currentQuestion"
                :question-number="currentQuestionNumber"
                :total-questions="totalQuestions"
                :selected-value="currentAnswer"
                :options="attachmentTest.options"
                @select="handleSelect"
              />

              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex flex-wrap gap-3">
                  <button
                    type="button"
                    :class="secondaryButtonClass"
                    :disabled="currentQuestionNumber === 1"
                    @click="goToPreviousQuestion"
                  >
                    Back
                  </button>
                  <button type="button" :class="tertiaryButtonClass" @click="openRestartConfirm">
                    Restart
                  </button>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                  <span v-if="currentAnswer === null" class="text-sm text-muted">
                    Pick one answer to continue
                  </span>
                  <span v-else-if="continueLocked" class="text-sm text-muted">
                    Review your choice, then continue
                  </span>

                  <button
                    type="button"
                    :class="primaryButtonClass"
                    :disabled="!canContinue"
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

    <ConfirmDialog
      :open="showRestartConfirm"
      kicker="Restart test"
      title="Start over from the beginning?"
      description="This will clear your current progress and bring back the intro and before-you-begin sections."
      confirm-label="Yes, restart"
      cancel-label="Keep current progress"
      @close="showRestartConfirm = false"
      @confirm="confirmRestart"
    />
  </section>
</template>
