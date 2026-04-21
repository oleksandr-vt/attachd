<script setup lang="ts">
import type { Ref } from 'vue'
import AppButton from '~/components/AppButton.vue'
import CouplesReportView from '~/components/CouplesReportView.vue'
import { useAttachmentPrimaryAction } from '~/composables/useAttachmentPrimaryAction'
import { useTest } from '~/composables/useTest'
import { buildAttachmentCouplesReport } from '~~/shared/attachment/couples-report'
import type { AttachmentCouplesPersistedReportResponse } from '~~/shared/attachment/couples-persistence'
import type { AttachmentPersistedResultResponse } from '~~/shared/attachment/persistence'
import type { AttachmentAnswerMap, AttachmentComputedResult } from '~~/shared/attachment/scoring'

const route = useRoute()
const requestUrl = useRequestURL()
const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`

const {
  computedResult,
  hasSubmittedResults,
  session,
  storageHydrated,
} = useTest('attachment')

const { href: primaryActionHref, label: primaryActionLabel } = useAttachmentPrimaryAction()

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const inputClass =
  'w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-dark outline-none transition-colors duration-200 placeholder:text-muted focus:border-terra'

const tokenPattern = /^[a-f0-9]{16}$/i

const getQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : ''
  }

  return typeof value === 'string' ? value : ''
}

const extractResultToken = (value: string) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (tokenPattern.test(trimmedValue)) {
    return trimmedValue.toLowerCase()
  }

  const matchedToken = trimmedValue.match(/\/r\/([a-f0-9]{16})(?:[/?#]|$)/i)

  return matchedToken?.[1]?.toLowerCase() ?? null
}

const rawSelfQuery = computed(() => getQueryValue(route.query.self))
const rawPartnerQuery = computed(() => getQueryValue(route.query.partner))

const selfToken = computed(() =>
  tokenPattern.test(rawSelfQuery.value) ? rawSelfQuery.value.toLowerCase() : null,
)
const partnerToken = computed(() =>
  tokenPattern.test(rawPartnerQuery.value) ? rawPartnerQuery.value.toLowerCase() : null,
)

const selfInput = ref(rawSelfQuery.value)
const partnerInput = ref(rawPartnerQuery.value)
const selfInputError = ref('')
const partnerInputError = ref('')
const selfFetchError = ref('')
const partnerFetchError = ref('')
const selfLoading = ref(false)
const partnerLoading = ref(false)
const saveError = ref('')
const savingReport = ref(false)
const selfPayload = ref<AttachmentPersistedResultResponse | null>(null)
const partnerPayload = ref<AttachmentPersistedResultResponse | null>(null)

const fetchPersistedResult = (token: string) =>
  $fetch<AttachmentPersistedResultResponse>(`/api/results/${token}`)

const loadPayload = async (
  token: string | null,
  target: Ref<AttachmentPersistedResultResponse | null>,
  error: Ref<string>,
  loading: Ref<boolean>,
  contextLabel: string,
) => {
  if (!token) {
    target.value = null
    error.value = ''
    return
  }

  loading.value = true
  error.value = ''

  try {
    target.value = await fetchPersistedResult(token)
  } catch {
    target.value = null
    error.value = `We could not load the ${contextLabel} result link. Paste a valid shared result URL or token.`
  } finally {
    loading.value = false
  }
}

await Promise.all([
  loadPayload(selfToken.value, selfPayload, selfFetchError, selfLoading, 'first'),
  loadPayload(partnerToken.value, partnerPayload, partnerFetchError, partnerLoading, 'partner'),
])

watch(selfToken, async (token) => {
  await loadPayload(token, selfPayload, selfFetchError, selfLoading, 'first')
})

watch(partnerToken, async (token) => {
  await loadPayload(token, partnerPayload, partnerFetchError, partnerLoading, 'partner')
})

watch(rawSelfQuery, (value) => {
  selfInput.value = value
})

watch(rawPartnerQuery, (value) => {
  partnerInput.value = value
})

const localSelfResult = computed<AttachmentComputedResult | null>(() =>
  storageHydrated.value && hasSubmittedResults.value ? computedResult.value : null,
)
const localSelfAnswers = computed<AttachmentAnswerMap | null>(() =>
  storageHydrated.value && hasSubmittedResults.value ? session.value.answers : null,
)

const resolvedSelfResult = computed<AttachmentComputedResult | null>(() =>
  selfPayload.value?.record.result ?? localSelfResult.value,
)
const resolvedPartnerResult = computed<AttachmentComputedResult | null>(() =>
  partnerPayload.value?.record.result ?? null,
)

const couplesReport = computed(() => {
  if (!resolvedSelfResult.value || !resolvedPartnerResult.value) {
    return null
  }

  return buildAttachmentCouplesReport(resolvedSelfResult.value, resolvedPartnerResult.value)
})

const hasSelfContext = computed(() => resolvedSelfResult.value !== null)
const isUsingLocalSelfResult = computed(() =>
  !selfPayload.value && localSelfResult.value !== null,
)

const selfResultHref = computed(() => {
  if (selfPayload.value?.record.token) {
    return `/r/${selfPayload.value.record.token}`
  }

  if (session.value.lastSharedResultToken) {
    return `/r/${session.value.lastSharedResultToken}`
  }

  if (resolvedSelfResult.value?.type) {
    return `/results/${resolvedSelfResult.value.type}`
  }

  return '/test/attachment'
})

const missingStateTitle = computed(() => {
  if (!hasSelfContext.value) {
    return 'Start with your own result.'
  }

  if (!resolvedPartnerResult.value) {
    return 'Add your partner result.'
  }

  return 'Compare both results.'
})

const missingStateCopy = computed(() => {
  if (!hasSelfContext.value) {
    return 'The couples report compares two completed attachment results. Finish your test or paste your own shared result link, then add your partner link.'
  }

  return 'Paste your partner shared result link or token below. The report will compare both profiles side by side and highlight the most likely friction and repair pattern.'
})

const selfStatusNote = computed(() => {
  if (selfPayload.value?.record.token) {
    return 'Using your shared result link.'
  }

  if (isUsingLocalSelfResult.value) {
    return 'Using your latest completed result from this device.'
  }

  return ''
})

const canPersistReport = computed(() =>
  couplesReport.value !== null && (
    Boolean(selfToken.value)
    || localSelfAnswers.value !== null
  ) && Boolean(partnerToken.value),
)

const submitComparison = async () => {
  selfInputError.value = ''
  partnerInputError.value = ''

  const nextSelfToken = hasSelfContext.value
    ? selfToken.value ?? session.value.lastSharedResultToken ?? null
    : extractResultToken(selfInput.value)
  const nextPartnerToken = extractResultToken(partnerInput.value)

  if (!hasSelfContext.value && !nextSelfToken) {
    selfInputError.value = 'Paste your result link or raw token.'
  }

  if (!nextPartnerToken) {
    partnerInputError.value = 'Paste your partner result link or raw token.'
  }

  if (nextSelfToken && nextPartnerToken && nextSelfToken === nextPartnerToken) {
    partnerInputError.value = 'Use a different partner result link.'
  }

  if (selfInputError.value || partnerInputError.value) {
    return
  }

  const query: Record<string, string> = {
    partner: nextPartnerToken as string,
  }

  if (nextSelfToken) {
    query.self = nextSelfToken
  }

  await navigateTo({
    path: '/couples',
    query,
  })
}

const createShareLink = async () => {
  if (!canPersistReport.value || !partnerToken.value) {
    return
  }

  saveError.value = ''
  savingReport.value = true

  try {
    const response = await $fetch<AttachmentCouplesPersistedReportResponse>('/api/couples', {
      method: 'POST',
      body: {
        left: selfToken.value
          ? { token: selfToken.value }
          : { answers: localSelfAnswers.value },
        right: { token: partnerToken.value },
      },
    })

    await navigateTo(`/couples/${response.record.token}`)
  } catch {
    saveError.value = 'We could not save a shareable couples report just now.'
  } finally {
    savingReport.value = false
  }
}

useSeoMeta({
  title: 'Couples Attachment Report',
  description:
    'Compare two completed attachment style results side by side to see likely conflict loops, stabilizers, and repair moves.',
  ogTitle: 'Couples Attachment Report | Attachd.',
  ogDescription:
    'Paste two attachment result links and generate a practical couples comparison.',
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
          <p class="landing-section-kicker">Couples report</p>
          <h1 class="landing-section-title">
            {{ couplesReport ? couplesReport.dynamicLabel : 'Compare two attachment results.' }}
          </h1>
          <p class="landing-section-copy max-w-160">
            {{ couplesReport ? couplesReport.overview : 'Paste two completed result links to see where the relationship is likely to feel safe, where it gets protective, and what repair move matters most for this pairing.' }}
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-4">
            <AppButton
              :href="selfResultHref"
              :label="couplesReport ? 'Open your result' : primaryActionLabel"
              size="sm"
              show-arrow
            />
            <span class="landing-action-note">
              {{ hasSelfContext ? 'Add your partner result below' : 'Needs two completed results' }}
            </span>
          </div>
        </header>

        <section :class="[panelShellClass, 'bg-white']">
          <p :class="noteKickerClass">Build the comparison</p>
          <h2 :class="sectionTitleClass">
            {{ hasSelfContext ? 'Add your partner shared result.' : 'Paste both shared result links.' }}
          </h2>
          <p :class="bodyCopyClass">
            {{ missingStateCopy }}
          </p>

          <div
            v-if="selfStatusNote"
            class="mt-6 rounded-2xl border border-border bg-sec-bg px-4 py-3 text-sm leading-6 text-dark2"
          >
            {{ selfStatusNote }}
          </div>

          <form class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="submitComparison">
            <label v-if="!hasSelfContext" class="grid gap-2">
              <span class="text-sm font-medium text-dark">Your shared result link</span>
              <input
                v-model="selfInput"
                type="text"
                :class="inputClass"
                placeholder="Paste /r/ link or raw token"
                autocomplete="off"
              >
              <span v-if="selfInputError" class="text-sm text-terra">{{ selfInputError }}</span>
            </label>

            <label class="grid gap-2" :class="hasSelfContext ? 'md:col-span-2' : ''">
              <span class="text-sm font-medium text-dark">Partner shared result link</span>
              <input
                v-model="partnerInput"
                type="text"
                :class="inputClass"
                placeholder="Paste /r/ link or raw token"
                autocomplete="off"
              >
              <span v-if="partnerInputError" class="text-sm text-terra">{{ partnerInputError }}</span>
            </label>

            <div class="md:col-span-2 flex flex-wrap items-center gap-4">
              <AppButton
                type="submit"
                size="sm"
                :disabled="selfLoading || partnerLoading"
              >
                {{ selfLoading || partnerLoading ? 'Loading results' : 'Build couples report' }}
              </AppButton>
              <span class="text-sm text-muted">Supports raw tokens or full shared result URLs.</span>
            </div>
          </form>

          <p v-if="selfFetchError" class="mt-4 text-sm leading-6 text-terra">
            {{ selfFetchError }}
          </p>
          <p v-if="partnerFetchError" class="mt-2 text-sm leading-6 text-terra">
            {{ partnerFetchError }}
          </p>
        </section>

        <div
          v-if="!couplesReport"
          :class="[panelShellClass, 'bg-sec-bg']"
        >
          <p :class="noteKickerClass">What this compares</p>
          <h2 :class="sectionTitleClass">{{ missingStateTitle }}</h2>
          <p :class="bodyCopyClass">
            {{ missingStateCopy }}
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-4">
            <AppButton :href="primaryActionHref" :label="primaryActionLabel" size="sm" show-arrow />
            <span class="text-sm text-muted">One completed result for each person.</span>
          </div>
        </div>

        <template v-else>
          <section :class="[panelShellClass, 'bg-white']">
            <p :class="noteKickerClass">Shareable version</p>
            <h2 :class="sectionTitleClass">Save this couples report.</h2>
            <p :class="bodyCopyClass">
              Persist this exact comparison as its own shareable snapshot so the pair read stays stable even outside this builder page.
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-4">
              <AppButton
                size="sm"
                :disabled="!canPersistReport || savingReport"
                @click="createShareLink"
              >
                {{ savingReport ? 'Creating share link' : 'Create share link' }}
              </AppButton>
              <span class="text-sm text-muted">Saves this exact couples comparison.</span>
            </div>

            <p v-if="saveError" class="mt-4 text-sm leading-6 text-terra">
              {{ saveError }}
            </p>
          </section>

          <CouplesReportView
            :report="couplesReport"
            :profile-labels="['You', 'Partner']"
          />
        </template>
      </div>
    </div>
  </section>
</template>
