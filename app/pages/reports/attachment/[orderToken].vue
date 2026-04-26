<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'
import type { AttachmentReportOrderResponse } from '~~/shared/attachment/report-order'

const route = useRoute()
const requestUrl = useRequestURL()
const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`

const routeToken = computed(() => {
  const value = Array.isArray(route.params.orderToken) ? route.params.orderToken[0] : route.params.orderToken

  if (typeof value !== 'string' || !/^[a-f0-9]{32}$/i.test(value)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Report order not found',
    })
  }

  return value.toLowerCase()
})

const fetchReportOrder = () =>
  $fetch<AttachmentReportOrderResponse>(`/api/reports/attachment/${routeToken.value}`)

const payload = ref(await fetchReportOrder())
const pollingError = ref('')
let pollingTimer: number | null = null

const checkoutCompleted = computed(() => {
  const value = Array.isArray(route.query.checkout) ? route.query.checkout[0] : route.query.checkout
  return value === 'complete'
})

const order = computed(() => payload.value.order)
const result = computed(() => payload.value.result)
const isPaid = computed(() => order.value.status === 'paid')
const downloadHref = computed(() => payload.value.downloadUrl ?? '')
const absoluteDownloadHref = computed(() =>
  downloadHref.value ? `${requestUrl.origin}${downloadHref.value}` : '',
)
const resultHref = computed(() => `/r/${result.value.token}`)
const createdAtLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(order.value.createdAt)),
)

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'

const refreshOrder = async () => {
  try {
    payload.value = await fetchReportOrder()
    pollingError.value = ''
  } catch {
    pollingError.value = 'We could not refresh your report status just now.'
  }
}

const stopPolling = () => {
  if (pollingTimer !== null) {
    window.clearInterval(pollingTimer)
    pollingTimer = null
  }
}

const startPolling = () => {
  if (!import.meta.client || pollingTimer !== null || isPaid.value) {
    return
  }

  pollingTimer = window.setInterval(async () => {
    await refreshOrder()

    if (isPaid.value) {
      stopPolling()
    }
  }, 2500)
}

watch(isPaid, (paid) => {
  if (paid) {
    stopPolling()
  } else {
    startPolling()
  }
})

onMounted(() => {
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})

useSeoMeta({
  title: 'Paid PDF Report',
  description: 'Download your paid Attachd attachment style PDF report.',
  robots: 'noindex,nofollow',
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
      <div class="grid gap-5 lg:grid-cols-3">
        <header :class="[panelShellClass, 'bg-sec-bg lg:col-span-2']">
          <p class="landing-section-kicker">Paid PDF report</p>
          <h1 class="landing-section-title">
            {{ isPaid ? 'Your PDF report is ready.' : 'Confirming your paid report.' }}
          </h1>
          <p class="landing-section-copy max-w-150">
            <template v-if="isPaid">
              Your {{ result.label }} attachment PDF has been unlocked. Download it now or come
              back to this access page whenever you need the report again.
            </template>
            <template v-else-if="checkoutCompleted">
              Payment was completed in Paddle. We are waiting for Paddle to confirm the transaction
              through the secure webhook, which usually takes a few seconds.
            </template>
            <template v-else>
              This access page is connected to a paid PDF report order. Once Paddle confirms the
              transaction, the download button will appear here.
            </template>
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-4">
            <AppButton
              v-if="isPaid && absoluteDownloadHref"
              :href="absoluteDownloadHref"
              label="Download PDF"
              size="sm"
              show-arrow
            />
            <AppButton
              v-else
              size="sm"
              :disabled="true"
            >
              Waiting for payment confirmation
            </AppButton>
            <AppButton
              :href="resultHref"
              label="Open original result"
              variant="secondary"
              size="sm"
              show-arrow
            />
          </div>

          <p v-if="pollingError" class="mt-4 text-sm leading-6 text-terra">
            {{ pollingError }}
          </p>
        </header>

        <aside :class="[panelShellClass, 'bg-white']">
          <p :class="noteKickerClass">Order snapshot</p>
          <h2 :class="sectionTitleClass">{{ result.label }} report</h2>
          <p :class="bodyCopyClass">
            Created on {{ createdAtLabel }}. Status:
            <strong>{{ order.status }}</strong>.
          </p>
          <p class="mt-4 text-sm leading-6 text-muted break-all">
            Order {{ order.token }}
          </p>
        </aside>

        <section :class="[panelShellClass, 'bg-white lg:col-span-3']">
          <p :class="noteKickerClass">What is included</p>
          <h2 :class="sectionTitleClass">A deeper deterministic attachment report.</h2>
          <p :class="bodyCopyClass">
            The PDF expands your saved result into a 15-section report covering score profile,
            dimensions, trigger clusters, protective habits, relationship needs, repair scripts,
            secure growth practices, reflection prompts, and an educational disclaimer.
          </p>
        </section>
      </div>
    </div>
  </section>
</template>
