<script setup lang="ts">
import { benefitCards } from '~/data/landing'
</script>

<template>
  <section id="results" aria-labelledby="results-heading" class="landing-section bg-sec-bg">
    <div class="landing-container">
      <header class="mb-10 max-w-160 sm:mb-14">
        <p class="landing-section-kicker">
          What you get
        </p>
        <h2 id="results-heading" class="landing-section-title">
          More useful than a vague personality score.
        </h2>
        <p class="landing-section-copy max-w-140">
          The test is built to give you a fast, understandable first result and leave the deeper
          follow-ups optional instead of forcing a heavy profile upfront.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:gap-6 xl:grid-cols-3">
        <article
          v-for="(card, index) in benefitCards"
          :key="card.title"
          class="flex flex-col gap-4 rounded-2xl border border-border bg-cream p-6 sm:gap-5 sm:p-8"
          :class="index === benefitCards.length - 1
            ? 'md:col-span-2 md:mx-auto md:max-w-125 xl:col-span-1 xl:mx-0 xl:max-w-none'
            : ''"
        >
          <p class="text-xs font-medium uppercase tracking-widest text-terra">
            {{ card.eyebrow }}
          </p>
          <h3 class="font-display text-2xl leading-tight font-medium tracking-tight text-dark">
            {{ card.title }}
          </h3>
          <p class="flex-1 text-sm leading-7 text-body">
            {{ card.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
