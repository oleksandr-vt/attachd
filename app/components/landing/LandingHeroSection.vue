<script setup lang="ts">
import { heroStats, landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section
    id="hero"
    aria-labelledby="hero-heading"
    class="landing-hero-section overflow-hidden bg-cream"
    :style="{
      backgroundImage:
        'radial-gradient(ellipse 600px 400px at 70% 50%, var(--landing-hero-glow) 0%, transparent 70%)',
    }"
  >
    <div class="landing-container flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
      <header class="min-w-0 flex-1">
        <p
          class="landing-section-kicker landing-fade-up"
          style="animation-delay: 0.05s"
        >
          Attachment Style Test
        </p>

        <h1
          id="hero-heading"
          class="hero-title mb-6 landing-fade-up"
          style="animation-delay: 0.15s"
        >
          Attachment style test<br>
          for the way you <em class="italic text-terra">love.</em>
        </h1>

        <p
          class="landing-section-copy landing-fade-up mb-8 max-w-125"
          style="animation-delay: 0.25s"
        >
          Take a 25-question attachment style test grounded in attachment theory. Learn whether
          your pattern is secure, anxious, avoidant, or fearful-avoidant - and what that means for
          closeness, conflict, and communication.
        </p>

        <div
          class="landing-fade-up mb-11 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5"
          style="animation-delay: 0.35s"
        >
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Start the free test" />
          <span class="landing-action-note">
            25 questions &middot; about 4 minutes
          </span>
        </div>

        <div
          class="landing-fade-up flex flex-wrap items-center gap-4 sm:gap-6"
          style="animation-delay: 0.45s"
        >
          <template v-for="(stat, index) in heroStats" :key="stat.label">
            <div class="flex flex-col gap-px">
              <b class="hero-stat-value text-lg font-medium text-dark">{{ stat.value }}</b>
              <span class="text-xs text-pale">{{ stat.label }}</span>
            </div>
            <div v-if="index < heroStats.length - 1" class="hidden h-7 w-px bg-border sm:block" />
          </template>
        </div>
      </header>

      <div
        aria-hidden="true"
        class="landing-fade-up-slow flex w-full justify-center lg:w-85 lg:shrink-0"
        style="animation-delay: 0.3s"
      >
        <div class="hero-stack relative">
          <div
            class="hero-panel hero-panel-back absolute top-2 -left-2 w-63 border border-secure-bd bg-secure-bg p-5.5 opacity-65"
          >
            <p class="mb-3.5 font-display text-base font-medium text-dark">Secure</p>
            <div class="hero-meter-stack flex flex-col">
              <div class="hero-meter overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-secure" style="width: 78%" />
              </div>
              <div class="hero-meter overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-secure opacity-45" style="width: 55%" />
              </div>
              <div class="hero-meter overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-secure opacity-25" style="width: 88%" />
              </div>
            </div>
          </div>

          <div
            class="hero-panel hero-panel-mid absolute top-7 -right-0.5 w-63 border border-anxious-bd bg-anxious-bg p-5.5 opacity-80"
          >
            <p class="mb-3.5 font-display text-base font-medium text-dark">Anxious</p>
            <div class="hero-meter-stack flex flex-col">
              <div class="hero-meter overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-anxious" style="width: 82%" />
              </div>
              <div class="hero-meter overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-anxious opacity-45" style="width: 44%" />
              </div>
              <div class="hero-meter overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-anxious opacity-25" style="width: 70%" />
              </div>
            </div>
          </div>

          <div
            class="hero-panel hero-panel-front landing-float-card absolute bottom-0 left-1/2 border border-border bg-white p-5.5 shadow-floating-card"
          >
            <div class="mb-3.5 flex items-center justify-between">
              <span class="hero-example-label font-medium uppercase text-pale">
                Example result
              </span>
              <span class="hero-chip rounded-full bg-avoid-bg px-3 py-1 font-medium text-avoid">
                Avoidant
              </span>
            </div>

            <p class="hero-copy mb-4 text-body">
              You value independence and can pull back when closeness feels intense. The full
              result explains the triggers behind that response and what more secure connection can
              look like.
            </p>

            <div class="mb-3.5 flex items-center gap-2.5">
              <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-avoid" style="width: 72%" />
              </div>
              <span class="whitespace-nowrap text-xs text-muted">Top pattern</span>
            </div>

            <div class="flex flex-wrap gap-1.5">
              <span class="hero-tag rounded-full bg-fearful-bg px-2.5 py-1 text-muted">
                Autonomy
              </span>
              <span class="hero-tag rounded-full bg-fearful-bg px-2.5 py-1 text-muted">
                Distance
              </span>
              <span class="hero-tag rounded-full bg-fearful-bg px-2.5 py-1 text-muted">
                Guarded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.02;
}

.hero-stat-value {
  letter-spacing: -0.01em;
}

.hero-stack {
  height: 28.75rem;
  transform: scale(0.88);
  transform-origin: top;
  width: 20rem;
}

.hero-panel {
  border-radius: 18px;
}

.hero-panel-back {
  transform: rotate(-7.5deg);
  z-index: 1;
}

.hero-panel-mid {
  transform: rotate(5.5deg);
  z-index: 2;
}

.hero-panel-front {
  transform: translateX(-50%) rotate(-1.5deg);
  width: 306px;
  z-index: 3;
}

.hero-meter-stack {
  gap: 7px;
}

.hero-meter {
  height: 7px;
}

.hero-example-label,
.hero-tag {
  font-size: 11px;
}

.hero-example-label {
  letter-spacing: 0.1em;
}

.hero-chip,
.hero-copy {
  font-size: 13px;
}

.hero-copy {
  line-height: 1.65;
}

@media (min-width: 40rem) {
  .hero-title {
    font-size: clamp(2.75rem, 4.8vw, 4.1rem);
  }

  .hero-stack {
    transform: none;
  }
}
</style>
