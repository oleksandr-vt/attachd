<script setup lang="ts">
import EmailGate from '~/components/EmailGate.vue'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
import ResultCard from '~/components/ResultCard.vue'
import type { AttachmentPersistedResultResponse } from '~~/shared/attachment/persistence'

const route = useRoute()
const requestUrl = useRequestURL()
const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`

const routeToken = computed(() => {
  const value = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token

  if (typeof value !== 'string' || !/^[a-f0-9]{16}$/i.test(value)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  return value
})

const fetchPersistedResult = () =>
  $fetch<AttachmentPersistedResultResponse>(`/api/results/${routeToken.value}`)

const payload = ref(await fetchPersistedResult())
const showEmailGate = ref(false)
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const pageMounted = ref(false)

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const subtleDetailsClass = 'mt-3 rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm leading-6 text-muted'
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-terra px-6 py-4 text-sm font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk'
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-4 text-sm font-medium text-dark transition-all duration-200 hover:-translate-y-px hover:border-soft-muted'

const record = computed(() => payload.value.record)
const result = computed(() => record.value.result)
const resultContent = computed(() => result.value.content)
const secondaryLabel = computed(() => result.value.ranking[1]?.label ?? resultContent.value.label)
const scoreNoteText = computed(() => result.value.scoreNote)
const sharePath = computed(() => `/r/${routeToken.value}`)
const shareUrl = computed(() => {
  if (!pageMounted.value || !import.meta.client) {
    return sharePath.value
  }

  return `${window.location.origin}${sharePath.value}`
})
const couplesReportHref = computed(() => `/couples?self=${routeToken.value}`)
const unlocked = computed(() => record.value.emailUnlocked)

const openEmailGate = () => {
  showEmailGate.value = true
}

const handleEmailSubmit = async (email: string) => {
  payload.value = await $fetch<AttachmentPersistedResultResponse>(`/api/results/${routeToken.value}/email`, {
    method: 'POST',
    body: { email },
  })
  showEmailGate.value = false
}

const copyShareLink = async () => {
  if (!import.meta.client) {
    return
  }

  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copyState.value = 'copied'
    window.setTimeout(() => {
      copyState.value = 'idle'
    }, 1600)
  } catch {
    copyState.value = 'failed'
  }
}

watch(routeToken, async () => {
  payload.value = await fetchPersistedResult()
})

onMounted(() => {
  pageMounted.value = true
})

useSeoMeta({
  title: `${resultContent.value.label} Attachment Result`,
  description: resultContent.value.seoDescription,
  ogTitle: `${resultContent.value.label} Attachment Result | Attachd.`,
  ogDescription: resultContent.value.shortSummary,
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
      <div class="relative grid gap-8 lg:grid-cols-3">
        <div class="min-w-0 lg:col-span-2 max-lg:contents">
          <header class="max-w-170 max-lg:order-1">
            <p class="landing-section-kicker">Shareable result</p>
            <h1 class="landing-section-title">
              {{ resultContent.label }} attachment.
            </h1>
            <p class="landing-section-copy">
              {{ result.subprofileSummary }}
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-4">
              <button type="button" :class="primaryButtonClass" @click="copyShareLink">
                {{ copyState === 'copied' ? 'Link copied' : 'Copy share link' }}
              </button>
              <LandingPrimaryButton
                href="/test/attachment"
                label="Retake the test"
              />
              <LandingPrimaryButton
                :href="`/results/${record.primaryType}`"
                label="Open type guide"
              />
            </div>

            <p v-if="copyState === 'failed'" class="mt-3 text-sm text-muted">
              Copy failed. You can still share the current page URL.
            </p>
          </header>

          <div class="lg:mt-10 grid gap-5 max-lg:order-3">
            <div :class="[panelShellClass, 'bg-sec-bg']">
              <p :class="noteKickerClass">Saved result snapshot</p>
              <p :class="noteCopyClass">
                Strongest pattern: <strong>{{ resultContent.label }}</strong>.
                Second pattern: <strong>{{ secondaryLabel }}</strong>.
                This shared link keeps the exact snapshot that was generated when the test was completed.
              </p>
            </div>

            <section :class="[panelShellClass, 'bg-white']">
              <p :class="noteKickerClass">Answer-based subprofile</p>
              <h2 :class="sectionTitleClass">{{ result.subprofileLabel }}</h2>
              <p :class="bodyCopyClass">
                {{ result.subprofileSummary }}
              </p>
              <p class="mt-4 text-sm leading-6 text-muted">
                {{ result.stylePairSummary }}
              </p>

              <div class="mt-6 grid gap-4 md:grid-cols-2">
                <div
                  v-for="dimension in result.dimensions"
                  :key="dimension.key"
                  class="rounded-3xl border border-border bg-sec-bg p-4"
                >
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-sm font-medium text-dark">{{ dimension.label }}</span>
                    <span class="text-sm font-medium text-terra">
                      {{ dimension.level.charAt(0).toUpperCase() + dimension.level.slice(1) }} / {{ dimension.percentage }}%
                    </span>
                  </div>
                  <p class="mt-3 text-sm leading-6 text-dark2">
                    {{ dimension.summary }}
                  </p>
                </div>
              </div>
            </section>

            <section :class="[panelShellClass, 'bg-white']">
              <p :class="noteKickerClass">Strongest trigger clusters</p>
              <h2 :class="sectionTitleClass">What activates this pattern fastest</h2>
              <ul class="grid gap-4">
                <li v-for="trigger in result.strongestTriggers" :key="trigger.key">
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
              v-if="!unlocked"
              :class="[panelShellClass, 'bg-dark text-cream']"
            >
              <p class="mb-2.5 text-xs font-medium uppercase tracking-widest text-terra-soft">Next step</p>
              <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-cream sm:text-[2.7rem]">
                Unlock the fuller breakdown.
              </h2>
              <p class="mt-3.5 max-w-140 text-[15px] leading-7 text-pale">
                {{ resultContent.reportPromo }}
              </p>
              <p class="mt-3 text-sm leading-6 text-pale">
                Unlocking saves the expanded guidance to this result link, including the prepared next steps and full trigger readout.
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <button type="button" :class="primaryButtonClass" @click="openEmailGate">
                  Continue with email
                </button>
                <span class="text-sm text-pale">Backend-backed and share-ready</span>
              </div>
            </div>

            <div v-if="unlocked" class="grid gap-5 md:grid-cols-2">
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
                <h2 :class="sectionTitleClass">Next steps prepared for this mix</h2>
                <ul class="grid gap-3.5">
                  <li v-for="item in result.nextSteps" :key="item">
                    <div class="flex items-start gap-3">
                      <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                      <span class="text-[15px] leading-7 text-dark2">{{ item }}</span>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            <div v-if="unlocked" class="grid gap-5 md:grid-cols-2">
              <section :class="[panelShellClass, 'bg-sec-bg']">
                <h2 :class="sectionTitleClass">Full trigger readout</h2>
                <ul class="grid gap-3.5">
                  <li v-for="trigger in result.triggerClusters" :key="trigger.key">
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
                <div class="mt-6 flex flex-wrap items-center gap-4">
                  <LandingPrimaryButton
                    :href="couplesReportHref"
                    label="Compare with partner"
                  />
                  <span class="text-sm text-muted">Paste your partner result link there.</span>
                </div>
              </section>
            </div>
          </div>
        </div>

        <aside class="lg:sticky lg:top-26 lg:self-start max-lg:order-2">
          <ResultCard
            :result="resultContent"
            :ranking="result.ranking"
            eyebrow="Your shareable attachment result"
          />
          <details :class="subtleDetailsClass">
            <summary class="cursor-pointer font-medium text-dark">How to read these bars</summary>
            <p class="mt-2">
              {{ scoreNoteText }}
            </p>
          </details>

          <div :class="[panelShellClass, 'mt-4 bg-sec-bg']">
            <p :class="noteKickerClass">Share link</p>
            <p class="text-sm leading-6 break-all text-body">
              {{ shareUrl }}
            </p>
          </div>
        </aside>
      </div>
    </div>

    <EmailGate
      :open="showEmailGate"
      :initial-email="record.email"
      @close="showEmailGate = false"
      @submit="handleEmailSubmit"
    />
  </section>
</template>
