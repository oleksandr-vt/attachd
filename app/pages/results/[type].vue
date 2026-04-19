<script setup lang="ts">
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
  startTest,
  unlockEmailGate,
} = useTest('attachment')

const resultContent = computed(() => getResultContent(routeType))
const showEmailGate = ref(false)

const hasPersonalizedResult = computed(() =>
  isComplete.value && computedResult.value?.type === routeType,
)

const personalizedResult = computed(() =>
  hasPersonalizedResult.value ? computedResult.value : null,
)

const showGuideSections = computed(() => !hasPersonalizedResult.value)
const showExpandedSections = computed(() =>
  hasPersonalizedResult.value && session.emailUnlocked,
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

const handleRetake = async () => {
  resetTest()
  startTest()
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
  <section class="landing-section bg-cream">
    <div class="landing-container">
      <div class="results-layout">
        <div class="min-w-0">
          <header class="max-w-170">
            <p class="landing-section-kicker">
              {{ hasPersonalizedResult ? 'Your result' : 'Attachment style guide' }}
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
                class="results-primary-button"
                @click="handleRetake"
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
              class="results-note-card border border-border bg-sec-bg"
            >
              <p class="results-note-kicker">Latest test read</p>
              <p class="results-note-copy">
                Your strongest score landed in <strong>{{ resultContent.label }}</strong>.
                Your second-strongest pattern was <strong>{{ secondaryLabel }}</strong>, which usually means your system can borrow a little from that style when stress rises.
              </p>
            </div>

            <div class="results-grid">
              <section class="results-panel border border-border bg-white">
                <h2 class="results-section-title">What tends to work well</h2>
                <ul class="results-list">
                  <li v-for="item in resultContent.strengths" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>

              <section class="results-panel border border-border bg-white">
                <h2 class="results-section-title">What can get protective</h2>
                <ul class="results-list">
                  <li v-for="item in resultContent.watchouts" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>
            </div>

            <div
              v-if="hasPersonalizedResult && !session.emailUnlocked"
              class="results-gate-card border border-border bg-dark"
            >
              <p class="results-note-kicker results-note-kicker-soft">Next step</p>
              <h2 class="results-gate-title">Unlock the fuller breakdown.</h2>
              <p class="results-gate-copy">
                {{ resultContent.reportPromo }}
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <button type="button" class="results-primary-button" @click="openEmailGate">
                  Continue with email
                </button>
                <span class="results-gate-note">Frontend-ready now, API-ready next</span>
              </div>
            </div>

            <div v-if="showExpandedSections" class="results-grid">
              <section class="results-panel border border-border bg-sec-bg">
                <h2 class="results-section-title">What helps you feel secure</h2>
                <ul class="results-list">
                  <li v-for="item in resultContent.relationshipNeeds" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>

              <section class="results-panel border border-border bg-sec-bg">
                <h2 class="results-section-title">Where to grow next</h2>
                <ul class="results-list">
                  <li v-for="item in resultContent.growthMoves" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>
            </div>

            <div v-if="showGuideSections" class="results-note-card border border-border bg-sec-bg">
              <p class="results-note-kicker">Direct visit</p>
              <p class="results-note-copy">
                This page works as a guide for the {{ resultContent.label.toLowerCase() }} pattern.
                If you want a personalized read, take the {{ attachmentTest.questions.length }}-question test first and come back through your own result route.
              </p>
            </div>

            <div v-if="showGuideSections" class="results-grid">
              <section class="results-panel border border-border bg-white">
                <h2 class="results-section-title">In relationships you usually need</h2>
                <ul class="results-list">
                  <li v-for="item in resultContent.relationshipNeeds" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>

              <section class="results-panel border border-border bg-white">
                <h2 class="results-section-title">What moves you toward secure attachment</h2>
                <ul class="results-list">
                  <li v-for="item in resultContent.growthMoves" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>
            </div>

            <div class="results-grid">
              <section class="results-panel border border-border bg-cream">
                <p class="results-note-kicker">Premium report</p>
                <h2 class="results-section-title">Go deeper than the label.</h2>
                <p class="results-panel-copy">
                  {{ resultContent.reportPromo }}
                </p>
              </section>

              <section class="results-panel border border-border bg-cream">
                <p class="results-note-kicker">Partner flow</p>
                <h2 class="results-section-title">Turn it into a couples read.</h2>
                <p class="results-panel-copy">
                  {{ resultContent.partnerPrompt }}
                </p>
              </section>
            </div>
          </div>
        </div>

        <aside class="results-sidebar">
          <ResultCard
            :result="resultContent"
            :ranking="personalizedResult?.ranking ?? []"
            :eyebrow="hasPersonalizedResult ? 'Your attachment result' : 'Attachment style overview'"
          />

          <div class="results-share-card border border-border bg-sec-bg">
            <p class="results-note-kicker">Share hook</p>
            <p class="results-panel-copy">
              {{ resultContent.sharePrompt }}
            </p>
          </div>
        </aside>
      </div>
    </div>

    <EmailGate
      :open="showEmailGate"
      :initial-email="session.email"
      @close="showEmailGate = false"
      @submit="handleEmailSubmit"
    />
  </section>
</template>

<style scoped>
.results-layout {
  display: grid;
  gap: 2rem;
}

.results-grid {
  display: grid;
  gap: 1.25rem;
}

.results-panel,
.results-note-card,
.results-gate-card,
.results-share-card {
  border-radius: 24px;
  padding: 1.5rem;
}

.results-section-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.12;
  margin-bottom: 1rem;
}

.results-panel-copy,
.results-note-copy {
  color: var(--color-body);
  font-size: 15px;
  line-height: 1.75;
}

.results-note-kicker {
  color: var(--color-terra);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 0.625rem;
  text-transform: uppercase;
}

.results-note-kicker-soft {
  color: var(--color-terra-soft);
}

.results-list {
  display: grid;
  gap: 0.875rem;
}

.results-list li {
  color: var(--color-dark2);
  line-height: 1.65;
  list-style: none;
  padding-left: 1.2rem;
  position: relative;
}

.results-list li::before {
  background-color: var(--color-terra);
  border-radius: 999px;
  content: '';
  height: 0.35rem;
  left: 0;
  position: absolute;
  top: 0.68rem;
  width: 0.35rem;
}

.results-gate-card {
  color: var(--color-cream);
}

.results-gate-title {
  color: var(--color-cream);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
}

.results-gate-copy {
  color: var(--color-pale);
  font-size: 15px;
  line-height: 1.75;
  margin-top: 0.875rem;
  max-width: 38rem;
}

.results-gate-note {
  color: var(--color-pale);
  font-size: 13px;
}

.results-primary-button,
.results-ghost-button {
  border-radius: 999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  padding: 0.95rem 1.35rem;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.results-primary-button {
  background-color: var(--color-terra);
  color: var(--color-cream);
}

.results-primary-button:hover,
.results-ghost-button:hover {
  transform: translateY(-1px);
}

.results-ghost-button {
  background-color: var(--color-sec-bg);
  border: 1px solid var(--color-border);
  color: var(--color-dark);
}

.results-share-card {
  margin-top: 1rem;
}

@media (min-width: 64rem) {
  .results-layout {
    grid-template-columns: minmax(0, 1fr) minmax(19rem, 24rem);
  }

  .results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .results-sidebar {
    position: sticky;
    top: 6.5rem;
    align-self: start;
  }
}
</style>
