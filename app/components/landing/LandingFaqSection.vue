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
      <header class="mx-auto mb-10 max-w-170 text-center sm:mb-12">
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
          class="rounded-2xl border bg-sec-bg p-6 transition-colors duration-200 sm:p-8"
          :class="openIndex === index
            ? 'border-pale'
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
              <span class="font-display text-2xl leading-tight font-medium tracking-tight text-dark">
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
          <Transition
            enter-active-class="overflow-hidden transition-all duration-200 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-56 opacity-100"
            leave-active-class="overflow-hidden transition-all duration-200 ease-in"
            leave-from-class="max-h-56 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <dd
              v-if="openIndex === index"
              :id="`faq-panel-${index}`"
              class="overflow-hidden"
            >
              <div class="mt-4 border-t border-border pt-4 text-sm leading-7 text-body">
                {{ item.answer }}
              </div>
            </dd>
          </Transition>
        </div>
      </dl>
    </div>
  </section>
</template>
