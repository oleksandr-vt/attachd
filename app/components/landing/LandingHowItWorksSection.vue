<script setup lang="ts">
import { landingPrimaryActionHref, processSteps } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="how" aria-labelledby="how-heading" class="landing-section bg-cream">
    <div class="landing-container">
      <header class="mb-14 flex flex-col items-center text-center">
        <p class="landing-section-kicker">
          The process
        </p>
        <h2 id="how-heading" class="landing-section-title mb-0">
          How the attachment style test works.
        </h2>
      </header>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-12">
        <article
          v-for="(step, index) in processSteps"
          :key="step.number"
          class="how-step-card border border-border bg-sec-bg p-5 sm:p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
        >
          <div class="flex gap-4 lg:block">
            <div class="flex w-10 shrink-0 flex-col items-center lg:hidden">
              <span class="landing-step-badge">{{ step.number }}</span>
              <span class="how-step-line mt-3 w-px flex-1 bg-linear-to-b from-terra/45 via-border to-border" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="mb-6 hidden items-center gap-4 lg:flex">
                <span
                  class="h-px flex-1"
                  :class="index === 0 ? 'opacity-0' : 'bg-linear-to-r from-transparent via-border to-border'"
                />
                <span class="landing-step-badge">{{ step.number }}</span>
                <span
                  class="h-px flex-1"
                  :class="index === processSteps.length - 1
                    ? 'opacity-0'
                    : 'bg-linear-to-r from-border via-border to-transparent'"
                />
              </div>

              <h3 class="how-step-title mb-3 lg:text-center">
                {{ step.title }}
              </h3>
              <p class="how-step-copy lg:text-center">{{ step.description }}</p>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
        <LandingPrimaryButton :href="landingPrimaryActionHref" label="Start the assessment" />
        <span class="landing-action-note">
          Quick first result &middot; private and simple
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how-step-card {
  border-radius: 18px;
}

.how-step-line {
  min-height: 2rem;
}

.how-step-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.how-step-copy {
  color: var(--color-body);
  font-size: 15px;
  line-height: 1.7;
}
</style>
