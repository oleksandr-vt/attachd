<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'
import CouplesReportView from '~/components/CouplesReportView.vue'
import ShareLinkField from '~/components/ShareLinkField.vue'
import { useCanonicalUrl } from '~/composables/useSiteOrigin'
import type { AttachmentCouplesPersistedReportResponse } from '~~/shared/attachment/couples-persistence'

const route = useRoute()
const canonicalUrl = useCanonicalUrl()

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

const { data: payload, error: payloadError } = await useAsyncData(
  `attachment-couples-report-${routeToken.value}`,
  () => $fetch<AttachmentCouplesPersistedReportResponse>(`/api/couples/${routeToken.value}`),
)

const resolvedPayload = payload.value

if (!resolvedPayload) {
  throw createError({
    statusCode: payloadError.value?.statusCode ?? 404,
    statusMessage: payloadError.value?.statusMessage ?? 'Couples report not found',
    fatal: true,
  })
}

const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const pageMounted = ref(false)

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const record = computed(() => resolvedPayload.record)
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

onMounted(() => {
  pageMounted.value = true
})

useSeoMeta({
  title: `${report.value.dynamicLabel} Couples Report`,
  description: report.value.overview,
  ogTitle: `${report.value.dynamicLabel} Couples Report | Attachd.`,
  ogDescription: report.value.triggerSummary,
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
      <div class="grid gap-5">
        <header :class="[panelShellClass, 'bg-sec-bg']">
          <p class="landing-section-kicker">Shared couples report</p>
          <h1 class="landing-section-title">
            {{ report.dynamicLabel }}
          </h1>
          <p class="landing-section-copy max-w-160">
            {{ report.overview }}
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-4">
            <AppButton size="sm" @click="copyShareLink">
              {{ copyState === 'copied' ? 'Link copied' : 'Copy share link' }}
            </AppButton>
            <AppButton
              :href="rebuildHref"
              label="Open comparison builder"
              size="sm"
              show-arrow
            />
          </div>

          <p v-if="copyState === 'failed'" class="mt-3 text-sm text-muted">
            Copy failed. You can still share the current page URL.
          </p>
        </header>

        <section :class="[panelShellClass, 'bg-white']">
          <p :class="noteKickerClass">Source pair</p>
          <h2 :class="sectionTitleClass">
            {{ record.leftResult.content.label }} + {{ record.rightResult.content.label }}
          </h2>
          <p class="text-[15px] leading-7 text-body">
            Based on two completed attachment results captured on {{ createdAtLabel }}.
          </p>
        </section>

        <CouplesReportView
          :report="report"
          :profile-labels="['Partner A', 'Partner B']"
        />

        <section :class="[panelShellClass, 'bg-white']">
          <ShareLinkField :value="shareUrl" />
        </section>
      </div>
    </div>
  </section>
</template>
