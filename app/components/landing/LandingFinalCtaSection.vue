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
      <p class="landing-section-kicker-soft">
        Start with the free result
      </p>
      <h2
        id="final-cta-heading"
        class="finale-title mb-5"
      >
        Find your attachment style<br>
        and get a clearer relationship map.
      </h2>
      <p class="finale-copy max-w-120 text-center text-muted">
        Start with the 25-question test and see which attachment pattern fits best.<br class="hidden sm:block">
        A clearer read of your relationship habits starts here.
      </p>
      <LandingPrimaryButton
        :href="landingPrimaryActionHref"
        label="Start the free test"
        size="lg"
      />
      <p class="finale-note max-w-100 text-center text-body">
        Educational, not diagnostic.
      </p>
    </div>
  </section>
</template>

<style scoped>
.finale-title {
  color: var(--color-cream);
  font-family: var(--font-display);
  font-size: clamp(2.15rem, 3.8vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
}

.finale-copy {
  font-size: 17px;
  line-height: 1.7;
}

.finale-note {
  font-size: 13px;
}
</style>
