<script setup lang="ts">
import { landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section
    aria-labelledby="final-cta-heading"
    class="landing-finale-section bg-dark text-center"
    :style="{
      backgroundImage:
        'radial-gradient(ellipse 600px 400px at 30% 50%, var(--landing-finale-glow) 0%, transparent 70%)',
    }"
  >
    <div class="landing-container flex flex-col items-center gap-6">
      <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra-soft">
        Start with the free result
      </p>
      <h2
        id="final-cta-heading"
        class="mb-5 font-display text-[clamp(2.15rem,3.8vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-cream"
      >
        Find your attachment style<br>
        and get a clearer relationship map.
      </h2>
      <p class="max-w-[480px] text-center text-[1.0625rem] leading-[1.7] text-muted">
        Start with the 25-question test and see which attachment pattern fits best.<br class="hidden sm:block">
        A clearer read of your relationship habits starts here.
      </p>
      <LandingPrimaryButton
        :href="landingPrimaryActionHref"
        label="Start the free test"
        size="lg"
      />
      <p class="max-w-[400px] text-center text-[0.8125rem] text-body">
        Educational, not diagnostic.
      </p>
    </div>
  </section>
</template>
