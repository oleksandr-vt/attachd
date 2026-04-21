<script setup lang="ts">
import type { Ref } from 'vue'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
import { useAttachmentPrimaryAction } from '~/composables/useAttachmentPrimaryAction'
import { useTest } from '~/composables/useTest'
import {
  buildAttachmentCouplesReport,
  type AttachmentCouplesProfileSummary,
} from '~~/shared/attachment/couples-report'
import type { AttachmentPersistedResultResponse } from '~~/shared/attachment/persistence'
import type { AttachmentComputedResult } from '~~/shared/attachment/scoring'

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
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-terra px-6 py-4 text-sm font-medium text-cream transition-all duration-200 hover:-translate-y-px hover:bg-terra-dk disabled:cursor-not-allowed disabled:opacity-60'
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
    return 'The first version of the couples report compares two completed attachment results. Finish your test or paste your own shared result link, then add your partner link.'
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

const renderProfileLabel = (profile: AttachmentCouplesProfileSummary, index: number) =>
  index === 0 ? 'You' : 'Partner'

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

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <LandingPrimaryButton
              :href="selfResultHref"
              :label="couplesReport ? 'Open your result' : primaryActionLabel"
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
              <button
                type="submit"
                :class="primaryButtonClass"
                :disabled="selfLoading || partnerLoading"
              >
                {{ selfLoading || partnerLoading ? 'Loading results' : 'Build couples report' }}
              </button>
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
            <LandingPrimaryButton :href="primaryActionHref" :label="primaryActionLabel" />
            <span class="text-sm text-muted">One completed result for each person.</span>
          </div>
        </div>

        <template v-else>
          <div class="grid gap-5 lg:grid-cols-3">
            <section :class="[panelShellClass, 'bg-white']">
              <p :class="noteKickerClass">Likely friction</p>
              <h2 :class="sectionTitleClass">Where this pair gets stuck</h2>
              <p :class="bodyCopyClass">
                {{ couplesReport.frictionSummary }}
              </p>
            </section>

            <section :class="[panelShellClass, 'bg-white']">
              <p :class="noteKickerClass">Built-in strength</p>
              <h2 :class="sectionTitleClass">What can stabilize it</h2>
              <p :class="bodyCopyClass">
                {{ couplesReport.strengthSummary }}
              </p>
            </section>

            <section :class="[panelShellClass, 'bg-white']">
              <p :class="noteKickerClass">Best repair move</p>
              <h2 :class="sectionTitleClass">What to do earlier</h2>
              <p :class="bodyCopyClass">
                {{ couplesReport.repairSummary }}
              </p>
            </section>
          </div>

          <section :class="[panelShellClass, 'bg-white']">
            <p :class="noteKickerClass">Activation map</p>
            <h2 :class="sectionTitleClass">What activates both systems fastest</h2>
            <p :class="bodyCopyClass">
              {{ couplesReport.triggerSummary }}
            </p>

            <div v-if="couplesReport.sharedThemes.length" class="mt-6 flex flex-wrap gap-2">
              <span
                v-for="theme in couplesReport.sharedThemes"
                :key="theme"
                class="rounded-full border border-border bg-sec-bg px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-dark2"
              >
                {{ theme }}
              </span>
            </div>
          </section>

          <div class="grid gap-5 xl:grid-cols-2">
            <section
              v-for="(profile, index) in couplesReport.profiles"
              :key="`${renderProfileLabel(profile, index)}-${profile.type}`"
              :class="[panelShellClass, 'bg-white']"
            >
              <p :class="noteKickerClass">{{ renderProfileLabel(profile, index) }}</p>

              <div
                class="rounded-3xl border p-5"
                :class="[profile.borderClass, profile.surfaceClass]"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-dark">
                      {{ profile.label }}
                    </h2>
                    <p class="mt-2 text-sm text-dark2">{{ profile.subprofileLabel }}</p>
                  </div>

                  <span
                    class="rounded-full px-3 py-1 text-center text-xs font-medium"
                    :class="profile.badgeClass"
                  >
                    {{ profile.eyebrow }}
                  </span>
                </div>

                <p class="mt-5 text-[15px] leading-7 text-dark2">
                  {{ profile.subprofileSummary }}
                </p>
              </div>

              <div class="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <p class="mb-3 text-xs font-medium uppercase tracking-widest text-pale">
                    Feels safer with
                  </p>
                  <ul class="grid gap-3">
                    <li v-for="item in profile.relationshipNeeds" :key="item" class="text-sm leading-6 text-dark2">
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div>
                  <p class="mb-3 text-xs font-medium uppercase tracking-widest text-pale">
                    Top triggers
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="trigger in profile.strongestTriggers"
                      :key="trigger"
                      class="rounded-full border border-border bg-sec-bg px-3 py-1.5 text-xs font-medium text-dark2"
                    >
                      {{ trigger }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-6 rounded-2xl border border-border bg-sec-bg px-4 py-4">
                <p class="mb-2 text-xs font-medium uppercase tracking-widest text-pale">
                  Best next step
                </p>
                <p class="text-sm leading-6 text-dark2">
                  {{ profile.firstNextStep }}
                </p>
              </div>
            </section>
          </div>

          <section :class="[panelShellClass, 'bg-sec-bg']">
            <p :class="noteKickerClass">Next moves</p>
            <h2 :class="sectionTitleClass">What makes this dynamic more secure</h2>
            <ul class="grid gap-4">
              <li v-for="move in couplesReport.repairMoves" :key="move">
                <div class="flex items-start gap-3">
                  <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                  <span class="text-[15px] leading-7 text-dark2">{{ move }}</span>
                </div>
              </li>
            </ul>
          </section>
        </template>
      </div>
    </div>
  </section>
</template>
