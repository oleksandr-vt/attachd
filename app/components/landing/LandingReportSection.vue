<script setup lang="ts">
import {
  landingPrimaryActionHref,
  reportChecklist,
  reportPreviewSlides,
  type ReportPreviewSlide,
} from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'

const reportSection = ref<HTMLElement | null>(null)
const activePreviewIndex = ref(0)
const isReportVisible = ref(false)
const prefersReducedMotion = ref(false)

const initialPreview = reportPreviewSlides[0]

if (!initialPreview) {
  throw new Error('Report preview slides are required.')
}

const activePreview = computed<ReportPreviewSlide>(
  () => reportPreviewSlides[activePreviewIndex.value] ?? initialPreview,
)

let rotationTimer: number | null = null
let visibilityObserver: IntersectionObserver | null = null
let motionQuery: MediaQueryList | null = null

const clearRotationTimer = () => {
  if (rotationTimer !== null) {
    window.clearInterval(rotationTimer)
    rotationTimer = null
  }
}

const syncRotationTimer = () => {
  clearRotationTimer()

  if (typeof window === 'undefined' || prefersReducedMotion.value || !isReportVisible.value || reportPreviewSlides.length < 2) {
    return
  }

  rotationTimer = window.setInterval(() => {
    activePreviewIndex.value = (activePreviewIndex.value + 1) % reportPreviewSlides.length
  }, 3200)
}

const setActivePreview = (index: number) => {
  activePreviewIndex.value = index
  syncRotationTimer()
}

const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
  prefersReducedMotion.value = event.matches
}

watch([isReportVisible, prefersReducedMotion], syncRotationTimer)

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', handleMotionPreferenceChange)

  visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      isReportVisible.value = entry.isIntersecting
    },
    { threshold: 0.4 },
  )

  if (reportSection.value) {
    visibilityObserver.observe(reportSection.value)
  }

  syncRotationTimer()
})

onBeforeUnmount(() => {
  clearRotationTimer()
  visibilityObserver?.disconnect()
  motionQuery?.removeEventListener('change', handleMotionPreferenceChange)
})
</script>

<template>
  <section
    id="report"
    ref="reportSection"
    aria-labelledby="report-heading"
    class="landing-section bg-sec-bg"
  >
    <div class="landing-container flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-20">
      <header class="min-w-0 flex-1">
        <p class="landing-section-kicker">
          Full in-depth report
        </p>
        <h2 id="report-heading" class="landing-section-title">
          Go beyond the label.
        </h2>
        <p class="landing-section-copy mb-8 max-w-125">
          The premium report is a 15-page PDF that explains how your pattern formed, where it shows
          up most often, and what more secure behavior can look like in real relationships.
        </p>

        <ul class="my-8 flex list-none flex-col gap-3">
          <li
            v-for="item in reportChecklist"
            :key="item"
            class="landing-checklist-item"
          >
            <span class="text-sm text-terra" aria-hidden="true">&rarr;</span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Start the free test" />
          <span class="landing-action-note">Free to start &middot; $9 for the 15-page report</span>
        </div>
      </header>

      <div class="flex w-full justify-center xl:w-auto xl:shrink-0">
        <div
          class="report-card w-full max-w-90 overflow-hidden border bg-white shadow-report-card transition-colors duration-500 xl:w-75 xl:max-w-none"
          :class="activePreview.borderClass"
        >
          <div class="flex items-center gap-1.5 border-b border-border bg-cream px-4 py-3">
            <span class="block h-2.5 w-2.5 rounded-full bg-border" />
            <span class="block h-2.5 w-2.5 rounded-full bg-border" />
            <span class="block h-2.5 w-2.5 rounded-full bg-border" />
          </div>

          <Transition name="report-preview" mode="out-in">
            <div :key="activePreview.title" class="p-6">
              <div class="mb-5 flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="report-kicker mb-1.5 font-medium uppercase text-terra">
                    Example full report
                  </p>
                  <h3 class="report-title">
                    {{ activePreview.title }}
                  </h3>
                </div>

                <span
                  class="report-chip rounded-full px-3 py-1 text-center text-xs font-medium"
                  :class="activePreview.badgeClass"
                >
                  {{ activePreview.title }}
                </span>
              </div>

              <p class="report-summary mb-5 text-body">
                {{ activePreview.summary }}
              </p>

              <div
                class="report-surface space-y-4 p-4 transition-colors duration-500"
                :class="activePreview.surfaceClass"
              >
                <div>
                  <p class="report-meta-label mb-1 font-medium uppercase text-pale">
                    Primary pattern
                  </p>
                  <p class="text-sm leading-normal text-dark2">
                    {{ activePreview.primaryPattern }}
                  </p>
                </div>

                <div>
                  <p class="report-meta-label mb-1 font-medium uppercase text-pale">
                    Core fear
                  </p>
                  <p class="text-sm leading-normal text-dark2">
                    {{ activePreview.coreFear }}
                  </p>
                </div>

                <div>
                  <p class="report-meta-label mb-1 font-medium uppercase text-pale">
                    Growth edge
                  </p>
                  <p class="text-sm leading-normal text-dark2">
                    {{ activePreview.growthEdge }}
                  </p>
                </div>
              </div>

              <div class="mt-5">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <p class="text-xs font-medium text-muted">Journey to secure</p>
                  <span class="report-progress-value font-medium" :class="activePreview.accentClass">
                    {{ activePreview.progress }}%
                  </span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-bar-bg">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="activePreview.barClass"
                    :style="{ width: `${activePreview.progress}%` }"
                  />
                </div>
              </div>
            </div>
          </Transition>

          <div class="border-t border-border bg-cream px-4 py-3">
            <div class="flex items-center gap-2">
              <button
                v-for="(preview, index) in reportPreviewSlides"
                :key="preview.title"
                type="button"
                class="group flex flex-1 items-center"
                :aria-label="`Show ${preview.title} preview`"
                :aria-pressed="index === activePreviewIndex"
                @click="setActivePreview(index)"
              >
                <span
                  class="h-1.5 flex-1 rounded-full transition-all duration-300"
                  :class="index === activePreviewIndex ? preview.barClass : 'bg-border group-hover:bg-pale'"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.report-preview-enter-active,
.report-preview-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}

.report-preview-enter-from {
  opacity: 0;
  transform: translateX(24px) scale(0.985);
}

.report-preview-leave-to {
  opacity: 0;
  transform: translateX(-24px) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .report-preview-enter-active,
  .report-preview-leave-active {
    transition: none;
  }
}

.report-card {
  border-radius: 18px;
}

.report-kicker {
  font-size: 11px;
  letter-spacing: 0.1em;
}

.report-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.08;
}

.report-progress-value {
  font-size: 13px;
}

.report-chip {
  line-height: 1.2;
}

.report-summary {
  font-size: 15px;
  line-height: 1.65;
}

.report-surface {
  border-radius: 16px;
}

.report-meta-label {
  font-size: 11px;
  letter-spacing: 0.08em;
}
</style>
