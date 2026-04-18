<script setup lang="ts">
import { faqItems } from '~/data/landing'

const openIndex = ref(0)

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <section id="faq" aria-labelledby="faq-heading" class="landing-section bg-cream">
    <div class="landing-container">
      <header class="mx-auto mb-12 max-w-[680px] text-center">
        <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra">
          FAQ
        </p>
        <h2
          id="faq-heading"
          class="mb-[1.125rem] font-display text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em] text-dark"
        >
          Common questions about the attachment style test.
        </h2>
        <p class="text-[1.0625rem] leading-[1.72] text-body">
          These answers cover what the MVP does today, what the test is for, and what kind of
          result flow people should expect.
        </p>
      </header>

      <dl class="mx-auto grid max-w-[860px] grid-cols-1 gap-4">
        <div
          v-for="(item, index) in faqItems"
          :key="item.question"
          class="rounded-[18px] border bg-sec-bg p-6 transition-colors duration-200 sm:p-8"
          :class="openIndex === index
            ? 'border-[#d9cfc3]'
            : 'border-border'"
        >
          <dt>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 text-left"
              :aria-controls="`faq-panel-${index}`"
              :aria-expanded="openIndex === index"
              @click="toggleFaq(index)"
            >
              <span class="font-display text-[1.375rem] font-medium leading-[1.2] tracking-[-0.02em] text-dark">
                {{ item.question }}
              </span>
              <span
                class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream/70 text-dark"
                aria-hidden="true"
              >
                <svg
                  class="h-4 w-4 transition-transform duration-200"
                  :class="openIndex === index ? 'rotate-180' : ''"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </dt>
          <Transition name="faq-answer">
            <dd
              v-if="openIndex === index"
              :id="`faq-panel-${index}`"
              class="overflow-hidden"
            >
              <div class="mt-4 border-t border-border pt-4 text-[0.9375rem] leading-[1.75] text-body">
                {{ item.answer }}
              </div>
            </dd>
          </Transition>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.faq-answer-enter-active,
.faq-answer-leave-active {
  overflow: hidden;
  transition:
    opacity 0.18s ease,
    max-height 0.18s ease;
}

.faq-answer-enter-from,
.faq-answer-leave-to {
  opacity: 0;
  max-height: 0;
}

.faq-answer-enter-to,
.faq-answer-leave-from {
  opacity: 1;
  max-height: 14rem;
}
</style>
