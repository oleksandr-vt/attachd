<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'
import { heroStats, landingPrimaryActionHref } from '~/data/landing'
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
    <div class="landing-container flex flex-col gap-10 sm:gap-12 xl:flex-row xl:items-center xl:gap-20">
      <header class="min-w-0 flex-1">
        <p
          class="landing-section-kicker landing-fade-up"
          style="animation-delay: 0.05s"
        >
          Attachment Style Test
        </p>

        <h1
          id="hero-heading"
          class="mb-5 font-display text-4xl leading-none font-medium tracking-tight text-dark landing-fade-up sm:mb-6 sm:text-5xl lg:text-6xl"
          style="animation-delay: 0.15s"
        >
          Attachment style test<br>
          for the way you <em class="italic text-terra">love.</em>
        </h1>

        <p
          class="landing-section-copy landing-fade-up mb-6 max-w-125 sm:mb-8"
          style="animation-delay: 0.25s"
        >
          Take a 25-question attachment style test grounded in attachment theory. Learn whether
          your pattern is secure, anxious, avoidant, or fearful-avoidant - and what that means for
          closeness, conflict, and communication.
        </p>

        <div
          class="landing-fade-up mb-8 flex flex-col items-start gap-4 sm:mb-11 sm:flex-row sm:items-center sm:gap-5"
          style="animation-delay: 0.35s"
        >
          <AppButton :href="landingPrimaryActionHref" label="Start the free test" show-arrow />
          <span class="landing-action-note">
            25 questions &middot; about 4 minutes
          </span>
        </div>

        <div
          class="landing-fade-up flex flex-wrap items-center gap-3 sm:gap-6"
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
        class="landing-fade-up-slow flex w-full justify-center xl:w-85 xl:shrink-0"
        style="animation-delay: 0.3s"
      >
        <div class="relative h-115 w-80 origin-top scale-85 sm:scale-100 -mr-40 xl:mr-0">
          <div
            class="absolute top-2 -left-2 z-0 w-63 rounded-2xl border border-secure-bd bg-secure-bg p-5.5 opacity-65"
            style="transform: rotate(-7.5deg)"
          >
            <p class="mb-3.5 font-display text-base font-medium text-dark">Secure</p>
            <div class="flex flex-col gap-2">
              <div class="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-secure" style="width: 78%" />
              </div>
              <div class="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-secure opacity-45" style="width: 55%" />
              </div>
              <div class="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-secure opacity-25" style="width: 88%" />
              </div>
            </div>
          </div>

          <div
            class="absolute top-7 -right-0.5 z-10 w-63 rounded-2xl border border-anxious-bd bg-anxious-bg p-5.5 opacity-80"
            style="transform: rotate(5.5deg)"
          >
            <p class="mb-3.5 font-display text-base font-medium text-dark">Anxious</p>
            <div class="flex flex-col gap-2">
              <div class="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-anxious" style="width: 82%" />
              </div>
              <div class="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-anxious opacity-45" style="width: 44%" />
              </div>
              <div class="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full rounded-full bg-anxious opacity-25" style="width: 70%" />
              </div>
            </div>
          </div>

          <div
            class="landing-float-card absolute bottom-0 left-1/2 z-20 w-76 -translate-x-1/2 rounded-2xl border border-border bg-white p-5.5 shadow-floating-card"
            style="transform: translateX(-50%) rotate(-1.5deg)"
          >
            <div class="mb-3.5 flex items-center justify-between">
              <span class="text-xs font-medium uppercase tracking-widest text-pale">
                Example result
              </span>
              <span class="rounded-full bg-avoid-bg px-3 py-1 text-xs font-medium text-avoid">
                Avoidant
              </span>
            </div>

            <p class="mb-4 text-xs leading-5 text-body">
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
              <span class="rounded-full bg-fearful-bg px-2.5 py-1 text-xs text-muted">
                Autonomy
              </span>
              <span class="rounded-full bg-fearful-bg px-2.5 py-1 text-xs text-muted">
                Distance
              </span>
              <span class="rounded-full bg-fearful-bg px-2.5 py-1 text-xs text-muted">
                Guarded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
