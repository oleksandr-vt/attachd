<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'
import ResultCard from '~/components/ResultCard.vue'
import ShareLinkField from '~/components/ShareLinkField.vue'
import { useCanonicalUrl } from '~/composables/useSiteOrigin'
import type { AttachmentPersistedResultResponse } from '~~/shared/attachment/persistence'

const route = useRoute()
const canonicalUrl = useCanonicalUrl()

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

const { data: payload, error: payloadError } = await useAsyncData(
  `attachment-result-${routeToken.value}`,
  () => $fetch<AttachmentPersistedResultResponse>(`/api/results/${routeToken.value}`),
)

const resolvedPayload = payload.value

if (!resolvedPayload) {
  throw createError({
    statusCode: payloadError.value?.statusCode ?? 404,
    statusMessage: payloadError.value?.statusMessage ?? 'Result not found',
    fatal: true,
  })
}

const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const pageMounted = ref(false)

const emailNotice = computed(() => {
  const value = Array.isArray(route.query.email) ? route.query.email[0] : route.query.email

  if (value === 'pending') {
    return {
      tone: 'bg-sec-bg',
      title: 'Check your inbox',
      body: 'Your result is open now. Confirm the link we just emailed you and we will send a copy of this result link to your inbox.',
    }
  }

  if (value === 'verified') {
    return {
      tone: 'bg-sec-bg',
      title: 'Email confirmed',
      body: 'Thanks, your email is confirmed for this saved result.',
    }
  }

  if (value === 'expired') {
    return {
      tone: 'bg-cream',
      title: 'Confirmation link expired',
      body: 'Your result is still available here. The confirmation link has expired, so no further emails will be sent for it.',
    }
  }

  if (value === 'unsent') {
    return {
      tone: 'bg-cream',
      title: 'Email not sent',
      body: 'Your result is saved, but we could not send the email right now. Keep this link to come back to it.',
    }
  }

  return null
})

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const subtleDetailsClass = 'mt-3 rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm leading-6 text-muted'
const record = computed(() => resolvedPayload.record)
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

onMounted(() => {
  pageMounted.value = true
})

useSeoMeta({
  title: `${resultContent.value.label} Attachment Result`,
  description: resultContent.value.seoDescription,
  ogTitle: `${resultContent.value.label} Attachment Result | Attachd.`,
  ogDescription: resultContent.value.shortSummary,
  twitterCard: 'summary',
  robots: 'noindex',
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
              <AppButton size="sm" @click="copyShareLink">
                {{ copyState === 'copied' ? 'Link copied' : 'Copy share link' }}
              </AppButton>
              <AppButton
                href="/test/attachment"
                label="Retake the test"
                size="sm"
                show-arrow
              />
            </div>

            <p v-if="copyState === 'failed'" class="mt-3 text-sm text-muted">
              Copy failed. You can still share the current page URL.
            </p>
          </header>

          <div class="lg:mt-10 grid gap-5 max-lg:order-3">
            <div
              v-if="emailNotice"
              :class="[panelShellClass, emailNotice.tone]"
            >
              <p :class="noteKickerClass">{{ emailNotice.title }}</p>
              <p :class="noteCopyClass">
                {{ emailNotice.body }}
              </p>
            </div>

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

            <div id="compare" :class="[panelShellClass, 'bg-dark text-cream']">
              <p class="mb-2.5 text-xs font-medium uppercase tracking-widest text-terra-soft">Partner flow</p>
              <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-cream sm:text-[2.7rem]">
                Turn it into a couples read.
              </h2>
              <p class="mt-3.5 max-w-140 text-[15px] leading-7 text-pale">
                {{ resultContent.partnerPrompt }}
              </p>
              <p class="mt-3 text-sm leading-6 text-pale">
                The couples report shows how your two patterns trigger each other, the conflict loop
                to watch for, and what helps each of you feel safer.
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <AppButton
                  :href="couplesReportHref"
                  label="Compare with partner"
                  size="sm"
                  show-arrow
                />
                <span class="text-sm text-pale">Paste your partner result link there.</span>
              </div>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
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

            <div class="grid gap-5 md:grid-cols-2">
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
            <ShareLinkField :value="shareUrl" />
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
