<script setup lang="ts">
import { landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section
    class="landing-finale-section bg-dark text-center"
    :style="{
      backgroundImage:
        'radial-gradient(ellipse 600px 400px at 30% 50%, var(--landing-finale-glow) 0%, transparent 70%)',
    }"
  >
    <div class="landing-container flex flex-col items-center gap-6">
      <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra-soft">
        Ready when you are
      </p>
      <h2
        class="mb-5 font-playfair text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.15] tracking-[-0.025em] text-cream"
      >
        The patterns running<br>
        your love life have a name.
      </h2>
      <p class="max-w-[480px] text-center text-[1.0625rem] leading-[1.7] text-muted">
        Take the free assessment and finally understand<br class="hidden sm:block">
        why you feel what you feel in relationships.
      </p>
      <LandingPrimaryButton
        :href="landingPrimaryActionHref"
        label="Discover your style - it's free"
        size="lg"
      />
      <p class="max-w-[400px] text-center text-[0.8125rem] text-body">
        No sign-up required. Enter your email after to receive your full report.
      </p>
    </div>
  </section>
</template>
