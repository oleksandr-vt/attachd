<script setup lang="ts">
import { benefitCards } from '~/data/landing'
</script>

<template>
  <section id="results" aria-labelledby="results-heading" class="landing-section bg-sec-bg">
    <div class="landing-container">
      <header class="mb-14 max-w-[640px]">
        <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra">
          What you get
        </p>
        <h2
          id="results-heading"
          class="mb-[1.125rem] font-display text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em] text-dark"
        >
          More useful than a vague personality score.
        </h2>
        <p class="max-w-[560px] text-[1.0625rem] leading-[1.72] text-body">
          The landing is built to give you a fast, understandable first result and leave the deeper
          follow-ups optional instead of forcing a heavy profile upfront.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="card in benefitCards"
          :key="card.title"
          class="flex flex-col gap-5 rounded-[18px] border border-border bg-cream p-6 sm:p-8"
        >
          <p class="text-xs font-medium uppercase tracking-[0.12em] text-terra">
            {{ card.eyebrow }}
          </p>
          <h3 class="font-display text-[1.5rem] font-medium leading-[1.2] tracking-[-0.02em] text-dark">
            {{ card.title }}
          </h3>
          <p class="flex-1 text-[0.9375rem] leading-[1.75] text-body">
            {{ card.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
