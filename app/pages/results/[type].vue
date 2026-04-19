<script setup lang="ts">
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import EmailGate from '~/components/EmailGate.vue'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
import ResultCard from '~/components/ResultCard.vue'
import { attachmentTest, isAttachmentStyleType, type AttachmentStyleType } from '~/data/tests/attachment'
import { attachmentResults } from '~/data/tests/results'
import { useResults } from '~/composables/useResults'
import { useTest } from '~/composables/useTest'

const route = useRoute()
const rawRouteType = computed(() => {
  const value = Array.isArray(route.params.type) ? route.params.type[0] : route.params.type
  return typeof value === 'string' ? value : ''
})

const routeType = computed<AttachmentStyleType>(() => {
  if (!rawRouteType.value || !isAttachmentStyleType(rawRouteType.value)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result type not found',
    })
  }

  return rawRouteType.value
})

const { getResultContent } = useResults()
const {
  computedResult,
  isComplete,
  resetTest,
  session,
  storageHydrated,
  unlockEmailGate,
} = useTest('attachment')

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
const subtleDetailsClass = 'mt-3 rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm leading-6 text-muted'

const emailUnlocked = computed(() => session.value.emailUnlocked)
const savedEmail = computed(() => session.value.email)
const storedPersonalizedResult = computed(() => session.value.lastComputedResult)
const livePersonalizedResult = computed(() =>
  isComplete.value ? computedResult.value : null,
)
const personalizedResult = computed(() => livePersonalizedResult.value ?? storedPersonalizedResult.value)
const personalizedType = computed(() => personalizedResult.value?.type ?? null)
const displayedType = computed<AttachmentStyleType>(() => personalizedType.value ?? routeType.value)
const resultContent = computed(() => getResultContent(displayedType.value))
const pageMounted = ref(false)

const hasPersonalizedResult = computed(() => personalizedResult.value !== null)
const hasDynamicProfile = computed(() => livePersonalizedResult.value !== null)
const isResolvingStoredResult = computed(() =>
  pageMounted.value && !storageHydrated.value,
)

const showGuideSections = computed(() =>
  !isResolvingStoredResult.value && !hasPersonalizedResult.value,
)
const showExpandedSections = computed(() =>
  hasDynamicProfile.value && emailUnlocked.value,
)

const secondaryLabel = computed(() => {
  const secondaryType = personalizedResult.value?.secondaryType

  return secondaryType ? attachmentResults[secondaryType].label : ''
})
const scoreNoteText = computed(() =>
  livePersonalizedResult.value?.scoreNote
    ?? 'These bars show your internal score profile inside this quiz. They are not population percentiles, validated cutoffs, or a clinical diagnosis.',
)

const formatScoreLevel = (level: string) =>
  `${level.charAt(0).toUpperCase()}${level.slice(1)}`

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

onMounted(() => {
  pageMounted.value = true
})

if (import.meta.client) {
  watch(
    [storageHydrated, personalizedType, routeType],
    async ([hydrated, nextType, currentType]) => {
      if (!hydrated || !nextType || nextType === currentType) {
        return
      }

      await navigateTo(`/results/${nextType}`, { replace: true })
    },
    { immediate: true },
  )
}

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
            <div v-if="isResolvingStoredResult" :class="[panelShellClass, 'bg-sec-bg']">
              <p :class="noteKickerClass">Loading saved result</p>
              <p :class="noteCopyClass">
                Checking your last completed test so the score profile, email gate, and next-step blocks can render from your saved answers instead of the static guide.
              </p>
            </div>

            <template v-else>
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

              <section
                v-if="hasDynamicProfile && livePersonalizedResult"
                :class="[panelShellClass, 'bg-white']"
              >
                <p :class="noteKickerClass">Answer-based subprofile</p>
                <h2 :class="sectionTitleClass">{{ livePersonalizedResult.subprofileLabel }}</h2>
                <p :class="bodyCopyClass">
                  {{ livePersonalizedResult.subprofileSummary }}
                </p>
                <p class="mt-4 text-sm leading-6 text-muted">
                  {{ livePersonalizedResult.stylePairSummary }}
                </p>

                <div class="mt-6 grid gap-4 md:grid-cols-2">
                  <div
                    v-for="dimension in livePersonalizedResult.dimensions"
                    :key="dimension.key"
                    class="rounded-3xl border border-border bg-sec-bg p-4"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-medium text-dark">{{ dimension.label }}</span>
                      <span class="text-sm font-medium text-terra">
                        {{ formatScoreLevel(dimension.level) }} / {{ dimension.percentage }}%
                      </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-dark2">
                      {{ dimension.summary }}
                    </p>
                  </div>
                </div>
              </section>

              <section
                v-if="hasDynamicProfile && livePersonalizedResult"
                :class="[panelShellClass, 'bg-white']"
              >
                <p :class="noteKickerClass">Strongest trigger clusters</p>
                <h2 :class="sectionTitleClass">What activates your system fastest</h2>
                <ul class="grid gap-4">
                  <li v-for="trigger in livePersonalizedResult.strongestTriggers" :key="trigger.key">
                    <div class="rounded-3xl border border-border bg-sec-bg p-4">
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-sm font-medium text-dark">{{ trigger.label }}</span>
                        <span class="text-sm font-medium text-terra">{{ trigger.percentage }}%</span>
                      </div>
                      <p class="mt-3 text-sm leading-6 text-dark2">
                        {{ trigger.summary }}
                      </p>
                    </div>
                  </li>
                </ul>
              </section>

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
                <p class="mt-3 text-sm leading-6 text-pale">
                  Ready next: your custom action steps, full trigger readout, and growth guidance keyed to this exact score mix.
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

                <section
                  v-if="livePersonalizedResult"
                  :class="[panelShellClass, 'bg-sec-bg']"
                >
                  <h2 :class="sectionTitleClass">Next steps prepared for this mix</h2>
                  <ul class="grid gap-3.5">
                    <li v-for="item in livePersonalizedResult.nextSteps" :key="item">
                      <div class="flex items-start gap-3">
                        <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                        <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>

              <div
                v-if="showExpandedSections && livePersonalizedResult"
                class="grid gap-5 md:grid-cols-2"
              >
                <section :class="[panelShellClass, 'bg-sec-bg']">
                  <h2 :class="sectionTitleClass">Full trigger readout</h2>
                  <ul class="grid gap-3.5">
                    <li v-for="trigger in livePersonalizedResult.triggerClusters" :key="trigger.key">
                      <div class="flex items-start gap-3">
                        <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                        <span class="text-[15px] leading-7 text-dark2">
                          <strong>{{ trigger.label }} ({{ trigger.percentage }}%)</strong>
                          {{ ' ' }}{{ trigger.summary }}
                        </span>
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
            </template>

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
          <details
            v-if="hasPersonalizedResult"
            :class="subtleDetailsClass"
          >
            <summary class="cursor-pointer font-medium text-dark">How to read these bars</summary>
            <p class="mt-2">
              {{ scoreNoteText }}
            </p>
          </details>

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
