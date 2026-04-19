<script setup lang="ts">
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import EmailGate from '~/components/EmailGate.vue'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
import ResultCard from '~/components/ResultCard.vue'
import { attachmentTest, isAttachmentStyleType } from '~/data/tests/attachment'
import { attachmentResults } from '~/data/tests/results'
import { useResults } from '~/composables/useResults'
import { useTest } from '~/composables/useTest'

const route = useRoute()
const routeType = Array.isArray(route.params.type) ? route.params.type[0] : route.params.type

if (!routeType || !isAttachmentStyleType(routeType)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Result type not found',
  })
}

const { getResultContent } = useResults()
const {
  computedResult,
  isComplete,
  resetTest,
  session,
  unlockEmailGate,
} = useTest('attachment')

const resultContent = computed(() => getResultContent(routeType))
const showEmailGate = ref(false)
const showRetakeConfirm = ref(false)

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-terra px-6 py-4 text-sm font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk'

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const softKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra-soft'

const emailUnlocked = computed(() => session.value.emailUnlocked)
const savedEmail = computed(() => session.value.email)
const storedPersonalizedResult = computed(() => {
  const storedResult = session.value.lastComputedResult

  return storedResult?.type === routeType ? storedResult : null
})

const livePersonalizedResult = computed(() =>
  isComplete.value && computedResult.value?.type === routeType
    ? computedResult.value
    : null,
)

const personalizedResult = computed(() =>
  livePersonalizedResult.value ?? storedPersonalizedResult.value,
)

const hasPersonalizedResult = computed(() => personalizedResult.value !== null)

const showGuideSections = computed(() => !hasPersonalizedResult.value)
const showExpandedSections = computed(() =>
  hasPersonalizedResult.value && emailUnlocked.value,
)

const secondaryLabel = computed(() => {
  const secondaryType = personalizedResult.value?.secondaryType

  return secondaryType ? attachmentResults[secondaryType].label : ''
})

const openEmailGate = () => {
  showEmailGate.value = true
}

const handleEmailSubmit = (email: string) => {
  unlockEmailGate(email)
  showEmailGate.value = false
}

const openRetakeConfirm = () => {
  showRetakeConfirm.value = true
}

const handleRetake = async () => {
  showRetakeConfirm.value = false
  resetTest()
  await navigateTo('/test/attachment')
}

const requestUrl = useRequestURL()
const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`

useSeoMeta({
  title: `${resultContent.value.label} Attachment Style`,
  description: resultContent.value.seoDescription,
  ogTitle: `${resultContent.value.seoTitle} | Attachd.`,
  ogDescription: resultContent.value.seoDescription,
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
      <div class="grid gap-8 lg:grid-cols-3">
        <div class="min-w-0 lg:col-span-2">
          <header class="max-w-170">
            <p class="landing-section-kicker">
              {{ hasPersonalizedResult ? 'Your results' : 'Attachment style guide' }}
            </p>
            <h1 class="landing-section-title">
              {{ resultContent.label }} attachment.
            </h1>
            <p class="landing-section-copy">
              {{ resultContent.description }}
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-4">
              <button
                v-if="hasPersonalizedResult"
                type="button"
                :class="primaryButtonClass"
                @click="openRetakeConfirm"
              >
                Retake the test
              </button>
              <LandingPrimaryButton
                v-else
                :href="'/test/attachment'"
                label="Take the 25-question test"
              />
              <LandingPrimaryButton
                :href="'/'"
                :label="hasPersonalizedResult ? 'Back to landing' : 'See the landing page'"
              />
            </div>
          </header>

          <div class="mt-10 grid gap-5">
            <div
              v-if="hasPersonalizedResult && personalizedResult"
              :class="[panelShellClass, 'bg-sec-bg']"
            >
              <p :class="noteKickerClass">Latest test read</p>
              <p :class="noteCopyClass">
                Your strongest score landed in <strong>{{ resultContent.label }}</strong>.
                Your second-strongest pattern was <strong>{{ secondaryLabel }}</strong>, which usually means your system can borrow a little from that style when stress rises.
              </p>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <section :class="[panelShellClass, 'bg-white']">
                <h2 :class="sectionTitleClass">What tends to work well</h2>
                <ul class="grid gap-3.5">
                  <li v-for="item in resultContent.strengths" :key="item">
                    <div class="flex items-start gap-3">
                      <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                      <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                    </div>
                  </li>
                </ul>
              </section>

              <section :class="[panelShellClass, 'bg-white']">
                <h2 :class="sectionTitleClass">What can get protective</h2>
                <ul class="grid gap-3.5">
                  <li v-for="item in resultContent.watchouts" :key="item">
                    <div class="flex items-start gap-3">
                      <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                      <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            <div
              v-if="hasPersonalizedResult && !emailUnlocked"
              :class="[panelShellClass, 'bg-dark text-cream']"
            >
              <p :class="softKickerClass">Next step</p>
              <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-cream sm:text-[2.7rem]">
                Unlock the fuller breakdown.
              </h2>
              <p class="mt-3.5 max-w-140 text-[15px] leading-7 text-pale">
                {{ resultContent.reportPromo }}
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <button type="button" :class="primaryButtonClass" @click="openEmailGate">
                  Continue with email
                </button>
                <span class="text-sm text-pale">Frontend-ready now, API-ready next</span>
              </div>
            </div>

            <div v-if="showExpandedSections" class="grid gap-5 md:grid-cols-2">
              <section :class="[panelShellClass, 'bg-sec-bg']">
                <h2 :class="sectionTitleClass">What helps you feel secure</h2>
                <ul class="grid gap-3.5">
                  <li v-for="item in resultContent.relationshipNeeds" :key="item">
                    <div class="flex items-start gap-3">
                      <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                      <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                    </div>
                  </li>
                </ul>
              </section>

              <section :class="[panelShellClass, 'bg-sec-bg']">
                <h2 :class="sectionTitleClass">Where to grow next</h2>
                <ul class="grid gap-3.5">
                  <li v-for="item in resultContent.growthMoves" :key="item">
                    <div class="flex items-start gap-3">
                      <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                      <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            <div v-if="showGuideSections" :class="[panelShellClass, 'bg-sec-bg']">
              <p :class="noteKickerClass">Direct visit</p>
              <p :class="noteCopyClass">
                This page works as a guide for the {{ resultContent.label.toLowerCase() }} pattern.
                If you want a personalized read, take the {{ attachmentTest.questions.length }}-question test first and come back through your own result route.
              </p>
            </div>

            <div v-if="showGuideSections" class="grid gap-5 md:grid-cols-2">
              <section :class="[panelShellClass, 'bg-white']">
                <h2 :class="sectionTitleClass">In relationships you usually need</h2>
                <ul class="grid gap-3.5">
                  <li v-for="item in resultContent.relationshipNeeds" :key="item">
                    <div class="flex items-start gap-3">
                      <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                      <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                    </div>
                  </li>
                </ul>
              </section>

              <section :class="[panelShellClass, 'bg-white']">
                <h2 :class="sectionTitleClass">What moves you toward secure attachment</h2>
                <ul class="grid gap-3.5">
                  <li v-for="item in resultContent.growthMoves" :key="item">
                    <div class="flex items-start gap-3">
                      <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                      <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <section :class="[panelShellClass, 'bg-cream']">
                <p :class="noteKickerClass">Premium report</p>
                <h2 :class="sectionTitleClass">Go deeper than the label.</h2>
                <p :class="bodyCopyClass">
                  {{ resultContent.reportPromo }}
                </p>
              </section>

              <section :class="[panelShellClass, 'bg-cream']">
                <p :class="noteKickerClass">Partner flow</p>
                <h2 :class="sectionTitleClass">Turn it into a couples read.</h2>
                <p :class="bodyCopyClass">
                  {{ resultContent.partnerPrompt }}
                </p>
              </section>
            </div>
          </div>
        </div>

        <aside class="lg:sticky lg:top-26 lg:self-start">
          <ResultCard
            :result="resultContent"
            :ranking="personalizedResult?.ranking ?? []"
            :eyebrow="hasPersonalizedResult ? 'Your attachment results' : 'Attachment style overview'"
          />

          <div :class="[panelShellClass, 'mt-4 bg-sec-bg']">
            <p :class="noteKickerClass">Share hook</p>
            <p :class="bodyCopyClass">
              {{ resultContent.sharePrompt }}
            </p>
          </div>
        </aside>
      </div>
    </div>

    <EmailGate
      :open="showEmailGate"
      :initial-email="savedEmail"
      @close="showEmailGate = false"
      @submit="handleEmailSubmit"
    />

    <ConfirmDialog
      :open="showRetakeConfirm"
      kicker="Retake test"
      title="Start the test over?"
      description="This will clear your saved progress and take you back to the beginning with the intro and before-you-begin sections visible again."
      confirm-label="Yes, retake"
      cancel-label="Keep my progress"
      @close="showRetakeConfirm = false"
      @confirm="handleRetake"
    />
  </section>
</template>
