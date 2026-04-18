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
      <header class="mx-auto mb-12 max-w-170 text-center">
        <p class="landing-section-kicker">
          FAQ
        </p>
        <h2 id="faq-heading" class="landing-section-title">
          Common questions about the attachment style test.
        </h2>
        <p class="landing-section-copy">
          These answers cover what the MVP does today, what the test is for, and what kind of
          result flow people should expect.
        </p>
      </header>

      <dl class="mx-auto grid max-w-215 grid-cols-1 gap-4">
        <div
          v-for="(item, index) in faqItems"
          :key="item.question"
          class="faq-card border bg-sec-bg p-6 transition-colors duration-200 sm:p-8"
          :class="openIndex === index
            ? 'faq-card-open'
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
              <span class="faq-card-title">
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
              <div class="faq-answer-copy mt-4 border-t border-border pt-4">
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

.faq-card {
  border-radius: 18px;
}

.faq-card-open {
  border-color: #d9cfc3;
}

.faq-card-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.faq-answer-copy {
  color: var(--color-body);
  font-size: 15px;
  line-height: 1.75;
}
</style>
