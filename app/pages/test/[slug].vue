<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import ProgressBar from '~/components/ProgressBar.vue'
import TestQuestion from '~/components/TestQuestion.vue'
import TurnstileWidget from '~/components/TurnstileWidget.vue'
import { attachmentResults } from '~/data/tests/results'
import { useCanonicalUrl } from '~/composables/useSiteOrigin'
import { useTest } from '~/composables/useTest'
import { getApiErrorMessage } from '~/utils/api-error'
import { isEmailFormatValid } from '~~/shared/email'
import type { AttachmentPersistedResultResponse } from '~~/shared/attachment/persistence'

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
  rememberEmail,
  resetTest,
  session,
  setAnswer,
  setSharedResultToken,
  storageHydrated,
  totalQuestions,
  completeTest,
  startTest,
} = useTest('attachment')

const canonicalUrl = useCanonicalUrl()
const showRestartConfirm = ref(false)
const continueLocked = ref(false)
const resultPublishError = ref('')
const emailError = ref('')
const savingResult = ref(false)
const generatingResult = ref(false)
const emailInput = ref(session.value.email)
const turnstileWidget = ref<InstanceType<typeof TurnstileWidget> | null>(null)
let continueUnlockTimeout: number | null = null
const resultRevealDelayMs = 1700
const resultLoadingSteps = [
  'Scoring your answer patterns',
  'Mapping your strongest triggers',
  'Preparing your saved result',
]

const waitForResultReveal = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, resultRevealDelayMs)
  })

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
    ? session.value.lastSharedResultToken
      ? 'Results ready'
      : 'Ready to save'
    : hasStarted.value
      ? `${remainingQuestions.value} left - about ${estimatedMinutesLeft.value} min`
      : 'No account needed',
)

const continueLabel = computed(() =>
  currentQuestionNumber.value === totalQuestions ? 'Finish the test' : 'Next question',
)

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
    if (completeTest()) {
      emailError.value = ''
      resultPublishError.value = ''
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
  resultPublishError.value = ''
  emailError.value = ''

  if (continueUnlockTimeout) {
    window.clearTimeout(continueUnlockTimeout)
    continueUnlockTimeout = null
  }

  resetTest()
}

const handleViewResult = async () => {
  if (!session.value.lastSharedResultToken) {
    return
  }

  await navigateTo(`/r/${session.value.lastSharedResultToken}`)
}

const getEmailNoticeQuery = (email: string, emailVerificationSent: boolean) => {
  if (emailVerificationSent) {
    return { email: 'pending' }
  }

  return email ? { email: 'unsent' } : {}
}

const submitResult = async () => {
  if (!hasSubmittedResults.value || !computedResult.value || savingResult.value) {
    return
  }

  const email = emailInput.value.trim()

  if (email && !isEmailFormatValid(email)) {
    emailError.value = 'Enter a valid email address, or leave the field empty.'
    return
  }

  emailError.value = ''
  resultPublishError.value = ''
  savingResult.value = true

  try {
    const turnstileToken = await turnstileWidget.value?.getToken() ?? ''
    generatingResult.value = true

    const [response] = await Promise.all([
      $fetch<AttachmentPersistedResultResponse>('/api/results', {
        method: 'POST',
        body: {
          answers: session.value.answers,
          email,
          turnstileToken,
        },
      }),
      waitForResultReveal(),
    ])

    if (email) {
      rememberEmail(email)
    }

    setSharedResultToken(response.record.token)
    await navigateTo({
      path: `/r/${response.record.token}`,
      query: getEmailNoticeQuery(email, response.emailVerificationSent),
    })
  } catch (error) {
    generatingResult.value = false
    resultPublishError.value = getApiErrorMessage(error, 'We could not save your result just now. Please try again.')
    turnstileWidget.value?.reset()
  } finally {
    savingResult.value = false
  }
}

watch(storageHydrated, (hydrated) => {
  if (hydrated && !emailInput.value) {
    emailInput.value = session.value.email
  }
}, { immediate: true })

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
    'A fast 25-question attachment style test with clear results and a shareable result page.',
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
  <section class="landing-page-section bg-cream">
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
                Move quickly, answer honestly, and lean on your first instinct. The questions are
                designed to surface how you respond when closeness, conflict, reassurance, and
                space start to feel emotionally charged.
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

              <div class="mt-6 flex flex-wrap items-center gap-4">
                <AppButton size="sm" @click="startTest()">
                  {{ beginLabel }}
                </AppButton>
                <span class="text-sm text-muted">No signup required to start</span>
              </div>
            </div>

            <div
              v-else-if="hasSubmittedResults && computedResult && (!session.lastSharedResultToken || generatingResult)"
              key="capture"
              class="rounded-3xl border border-border bg-sec-bg p-6 md:p-8"
            >
              <div v-if="generatingResult" class="grid gap-6">
                <div>
                  <p class="landing-section-kicker">Preparing result</p>
                  <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
                    Reading your attachment pattern.
                  </h2>
                  <p class="landing-section-copy mt-4 max-w-140">
                    We are turning your answers into a saved result snapshot.
                  </p>
                </div>

                <div class="max-w-130 rounded-3xl border border-border bg-white p-5">
                  <div class="h-2 overflow-hidden rounded-full bg-cream">
                    <div class="h-full w-1/2 rounded-full bg-terra motion-safe:animate-[result-loader_1.35s_ease-in-out_infinite]" />
                  </div>

                  <ul class="mt-5 grid gap-3">
                    <li
                      v-for="step in resultLoadingSteps"
                      :key="step"
                      class="flex items-center gap-3 text-sm leading-6 text-dark2"
                    >
                      <span class="size-2 rounded-full bg-terra motion-safe:animate-pulse" aria-hidden="true" />
                      <span>{{ step }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <template v-else>
                <p class="landing-section-kicker">One more step</p>
                <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
                  Your answers are complete.
                </h2>
                <p class="landing-section-copy mt-4 max-w-140">
                  Want a copy? Add your email and we will send you a link to your saved result,
                  or leave it empty and open your result right away.
                </p>

                <form class="mt-6 grid max-w-120 gap-3" @submit.prevent="submitResult">
                  <label class="grid gap-2">
                    <span class="text-sm font-medium text-dark">Email address (optional)</span>
                    <input
                      v-model="emailInput"
                      type="email"
                      autocomplete="email"
                      class="rounded-[18px] border border-border bg-white px-4 py-4 text-dark outline-none transition-all duration-200 focus:border-[#c9b8a9] focus:shadow-[0_0_0_3px_rgba(184,92,56,0.12)]"
                      placeholder="you@example.com"
                    >
                    <span class="text-xs leading-5 text-muted">
                      Used only to send you this result. Reply to that email anytime to have it deleted.
                    </span>
                  </label>

                  <p v-if="emailError" class="text-sm leading-6 text-terra-dk">
                    {{ emailError }}
                  </p>
                  <p v-if="resultPublishError" class="text-sm leading-6 text-terra-dk">
                    {{ resultPublishError }}
                  </p>

                  <div class="mt-2 flex flex-wrap items-center gap-4">
                    <AppButton type="submit" size="sm" :disabled="savingResult">
                      {{ savingResult ? 'Saving your result' : 'Continue to my results' }}
                    </AppButton>
                    <AppButton variant="outline" size="sm" @click="openRestartConfirm">
                      Retake the test
                    </AppButton>
                  </div>
                </form>
              </template>

              <TurnstileWidget ref="turnstileWidget" action="save-result" />
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
                Your result has been saved. You can open it again now or restart the full
                25-question flow if you want a fresh pass.
              </p>

              <div class="mt-6 flex flex-wrap items-center gap-4">
                <AppButton size="sm" @click="handleViewResult">
                  View my results
                </AppButton>
                <AppButton variant="outline" size="sm" @click="openRestartConfirm">
                  Retake the test
                </AppButton>
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
                  <AppButton
                    variant="secondary"
                    size="sm"
                    :disabled="currentQuestionNumber === 1"
                    @click="goToPreviousQuestion"
                  >
                    Back
                  </AppButton>
                  <AppButton variant="tertiary" size="sm" @click="openRestartConfirm">
                    Restart
                  </AppButton>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                  <span v-if="currentAnswer === null" class="text-sm text-muted">
                    Pick one answer to continue
                  </span>
                  <span v-else-if="continueLocked" class="text-sm text-muted">
                    Review your choice, then continue
                  </span>

                  <AppButton
                    size="sm"
                    :disabled="!canContinue"
                    @click="handleContinue"
                  >
                    {{ continueLabel }}
                  </AppButton>
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

<style>
@keyframes result-loader {
  0% {
    transform: translateX(-120%);
  }

  55% {
    transform: translateX(80%);
  }

  100% {
    transform: translateX(220%);
  }
}
</style>
