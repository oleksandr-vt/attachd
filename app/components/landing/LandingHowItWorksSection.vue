<script setup lang="ts">
import { landingPrimaryActionHref, processSteps } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="how" class="bg-cream px-8 py-24 max-[600px]:px-5 max-[600px]:py-[72px]">
    <div class="mx-auto max-w-[1160px]">
      <div class="mb-14 flex flex-col items-center text-center">
        <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra">
          The process
        </p>
        <h2
          class="font-playfair text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-dark"
        >
          Simple, private,<br>
          and genuinely useful.
        </h2>
      </div>

      <div class="relative grid grid-cols-3 gap-12 max-[860px]:grid-cols-1 max-[860px]:gap-8">
        <div
          class="absolute top-[1.125rem] right-[calc(16.666%+1rem)] left-[calc(16.666%+1rem)] h-px bg-[linear-gradient(90deg,#E4DDD3_0%,#E4DDD3_45%,transparent_50%,#E4DDD3_55%,#E4DDD3_100%)] max-[860px]:hidden"
        />

        <div v-for="step in processSteps" :key="step.number" class="flex flex-col gap-[0.875rem]">
          <span
            class="inline-block bg-cream pr-3 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-terra"
          >
            {{ step.number }}
          </span>
          <h3 class="font-playfair text-[1.375rem] font-medium leading-[1.3] text-dark">
            {{ step.title }}
          </h3>
          <p class="text-[0.9375rem] leading-[1.7] text-body">{{ step.description }}</p>
        </div>
      </div>

      <div class="mt-14 flex items-center justify-center gap-5 flex-wrap">
        <LandingPrimaryButton :href="landingPrimaryActionHref" label="Start the assessment" />
        <span class="text-[0.8125rem] text-pale">
          No account needed &middot; Results in 4 minutes
        </span>
      </div>
    </div>
  </section>
</template>
