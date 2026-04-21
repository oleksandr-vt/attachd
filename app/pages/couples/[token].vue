<script setup lang="ts">
import CouplesReportView from '~/components/CouplesReportView.vue'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
import type { AttachmentCouplesPersistedReportResponse } from '~~/shared/attachment/couples-persistence'

const route = useRoute()
const requestUrl = useRequestURL()
const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`

const routeToken = computed(() => {
  const value = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token

  if (typeof value !== 'string' || !/^[a-f0-9]{16}$/i.test(value)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Couples report not found',
    })
  }

  return value
})

const fetchPersistedReport = () =>
  $fetch<AttachmentCouplesPersistedReportResponse>(`/api/couples/${routeToken.value}`)

const payload = ref(await fetchPersistedReport())
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const pageMounted = ref(false)

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-terra px-6 py-4 text-sm font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk'

const record = computed(() => payload.value.record)
const report = computed(() => record.value.report)
const sharePath = computed(() => `/couples/${routeToken.value}`)
const shareUrl = computed(() => {
  if (!pageMounted.value || !import.meta.client) {
    return sharePath.value
  }

  return `${window.location.origin}${sharePath.value}`
})

const rebuildHref = computed(() => {
  if (!record.value.leftSourceToken || !record.value.rightSourceToken) {
    return '/couples'
  }

  const searchParams = new URLSearchParams({
    self: record.value.leftSourceToken,
    partner: record.value.rightSourceToken,
  })
  return `/couples?${searchParams.toString()}`
})
const createdAtLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(record.value.createdAt)),
)

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
  payload.value = await fetchPersistedReport()
})

onMounted(() => {
  pageMounted.value = true
})

useSeoMeta({
  title: `${report.value.dynamicLabel} Couples Report`,
  description: report.value.overview,
  ogTitle: `${report.value.dynamicLabel} Couples Report | Attachd.`,
  ogDescription: report.value.triggerSummary,
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
      <div class="grid gap-5">
        <header :class="[panelShellClass, 'bg-sec-bg']">
          <p class="landing-section-kicker">Shared couples report</p>
          <h1 class="landing-section-title">
            {{ report.dynamicLabel }}
          </h1>
          <p class="landing-section-copy max-w-160">
            {{ report.overview }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" :class="primaryButtonClass" @click="copyShareLink">
              {{ copyState === 'copied' ? 'Link copied' : 'Copy share link' }}
            </button>
            <LandingPrimaryButton
              :href="rebuildHref"
              label="Open comparison builder"
            />
          </div>

          <p v-if="copyState === 'failed'" class="mt-3 text-sm text-muted">
            Copy failed. You can still share the current page URL.
          </p>
        </header>

        <div class="grid gap-5 md:grid-cols-2">
          <section :class="[panelShellClass, 'bg-white']">
            <p :class="noteKickerClass">Saved snapshot</p>
            <h2 :class="sectionTitleClass">Stored as its own report.</h2>
            <p :class="bodyCopyClass">
              This couples comparison is saved as a separate snapshot, so the share link opens the same pair read without needing the original builder query.
            </p>
          </section>

          <section :class="[panelShellClass, 'bg-white']">
            <p :class="noteKickerClass">Source pair</p>
            <h2 :class="sectionTitleClass">
              {{ record.leftResult.content.label }} + {{ record.rightResult.content.label }}
            </h2>
            <p :class="bodyCopyClass">
              Based on two completed attachment results captured on {{ createdAtLabel }}.
            </p>
          </section>
        </div>

        <CouplesReportView
          :report="report"
          :profile-labels="['Partner A', 'Partner B']"
        />

        <section :class="[panelShellClass, 'bg-white']">
          <p :class="noteKickerClass">Share link</p>
          <p class="text-sm leading-6 break-all text-body">
            {{ shareUrl }}
          </p>
        </section>
      </div>
    </div>
  </section>
</template>
