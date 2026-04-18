<script setup lang="ts">
import { benefitCards } from '~/data/landing'
</script>

<template>
  <section id="results" aria-labelledby="results-heading" class="landing-section bg-sec-bg">
    <div class="landing-container">
      <header class="mb-14 max-w-160">
        <p class="landing-section-kicker">
          What you get
        </p>
        <h2 id="results-heading" class="landing-section-title">
          More useful than a vague personality score.
        </h2>
        <p class="landing-section-copy max-w-140">
          The landing is built to give you a fast, understandable first result and leave the deeper
          follow-ups optional instead of forcing a heavy profile upfront.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:gap-6 xl:grid-cols-3">
        <article
          v-for="(card, index) in benefitCards"
          :key="card.title"
          class="benefit-card flex flex-col gap-4 border border-border bg-cream p-6 sm:gap-5 sm:p-8"
          :class="index === benefitCards.length - 1
            ? 'md:col-span-2 md:mx-auto md:max-w-125 xl:col-span-1 xl:mx-0 xl:max-w-none'
            : ''"
        >
          <p class="benefit-card-kicker text-xs font-medium uppercase text-terra">
            {{ card.eyebrow }}
          </p>
          <h3 class="benefit-card-title">
            {{ card.title }}
          </h3>
          <p class="benefit-card-copy flex-1">
            {{ card.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.benefit-card {
  border-radius: 18px;
}

.benefit-card-kicker {
  letter-spacing: 0.12em;
}

.benefit-card-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.benefit-card-copy {
  color: var(--color-body);
  font-size: 15px;
  line-height: 1.75;
}
</style>
