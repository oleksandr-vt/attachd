<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'
import ResultCard from '~/components/ResultCard.vue'
import { attachmentTest, isAttachmentStyleType, type AttachmentStyleType } from '~/data/tests/attachment'
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
const { session } = useTest('attachment')

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'

const resultContent = computed(() => getResultContent(routeType.value))
const savedResultHref = computed(() =>
  session.value.lastSharedResultToken ? `/r/${session.value.lastSharedResultToken}` : '',
)
const hasSavedResult = computed(() => Boolean(session.value.lastSharedResultToken))
const couplesReportHref = computed(() =>
  session.value.lastSharedResultToken ? `/couples?self=${session.value.lastSharedResultToken}` : '/couples',
)

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
  <section class="landing-page-section bg-cream">
    <div class="landing-container">
      <div class="relative grid gap-8 lg:grid-cols-3">
        <div class="min-w-0 lg:col-span-2">
          <header class="max-w-170">
            <p class="landing-section-kicker">Attachment style guide</p>
            <h1 class="landing-section-title">
              {{ resultContent.label }} attachment.
            </h1>
            <p class="landing-section-copy">
              {{ resultContent.description }}
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-4">
              <AppButton
                href="/test/attachment"
                label="Take the 25-question test"
                size="sm"
                show-arrow
              />
              <AppButton
                v-if="hasSavedResult"
                :href="savedResultHref"
                label="Open my saved result"
                variant="secondary"
                size="sm"
                show-arrow
              />
            </div>
          </header>

          <div class="mt-10 grid gap-5">
            <section :class="[panelShellClass, 'bg-sec-bg']">
              <p :class="noteKickerClass">Style guide</p>
              <h2 :class="sectionTitleClass">
                See whether {{ resultContent.label.toLowerCase() }} is actually your pattern.
              </h2>
              <p :class="bodyCopyClass">
                {{ resultContent.longSummary }}
              </p>
              <p class="mt-4 text-sm leading-6 text-muted">
                This page explains the {{ resultContent.label.toLowerCase() }} pattern in general.
                The {{ attachmentTest.questions.length }}-question test checks whether it matches
                how you handle closeness, conflict, reassurance, and space in real relationships.
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <AppButton
                  href="/test/attachment"
                  label="Take the 25-question test"
                  size="sm"
                  show-arrow
                />
                <span class="text-sm text-muted">Free first result in about four minutes.</span>
              </div>
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

            <div class="grid gap-5 md:grid-cols-2">
              <section :class="[panelShellClass, 'bg-sec-bg']">
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
                <p :class="noteKickerClass">Your result</p>
                <h2 :class="sectionTitleClass">Get your own attachment read.</h2>
                <p :class="bodyCopyClass">
                  The test scores all four attachment styles side by side using your answers, then
                  shows the pattern that fits you best.
                </p>
                <div class="mt-6 flex flex-wrap items-center gap-4">
                  <AppButton
                    href="/test/attachment"
                    label="Take the 25-question test"
                    size="sm"
                    show-arrow
                  />
                  <AppButton
                    v-if="hasSavedResult"
                    :href="savedResultHref"
                    label="Open my saved result"
                    variant="secondary"
                    size="sm"
                    show-arrow
                  />
                </div>
              </section>

              <section :class="[panelShellClass, 'bg-cream']">
                <p :class="noteKickerClass">Partner flow</p>
                <h2 :class="sectionTitleClass">Turn it into a couples read.</h2>
                <p :class="bodyCopyClass">
                  {{ resultContent.partnerPrompt }}
                </p>
                <div class="mt-6 flex flex-wrap items-center gap-4">
                  <AppButton
                    :href="couplesReportHref"
                    label="Open couples report"
                    size="sm"
                    show-arrow
                  />
                  <span class="text-sm text-muted">Use two completed result links.</span>
                </div>
              </section>
            </div>
          </div>
        </div>

        <aside class="lg:sticky lg:top-26 lg:self-start">
          <ResultCard
            :result="resultContent"
            eyebrow="Attachment style overview"
          />

          <div :class="[panelShellClass, 'mt-4 bg-sec-bg']">
            <p :class="noteKickerClass">What the test adds</p>
            <p :class="bodyCopyClass">
              A guide explains the pattern in general. The test compares all four styles using your
              own answers so you can see which one actually fits best.
            </p>
            <div class="mt-6 flex flex-wrap items-center gap-4">
              <AppButton
                href="/test/attachment"
                label="Take the 25-question test"
                size="sm"
                show-arrow
              />
              <AppButton
                v-if="hasSavedResult"
                :href="savedResultHref"
                label="Open my saved result"
                variant="secondary"
                size="sm"
                show-arrow
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
