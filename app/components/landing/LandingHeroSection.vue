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
          class="mb-[1.125rem] block animate-[fade-up_.6s_ease_both] text-xs font-medium uppercase tracking-[0.12em] text-terra"
          style="animation-delay: 0.05s"
        >
          Attachment Style Test
        </p>

        <h1
          id="hero-heading"
          class="mb-6 animate-[fade-up_.6s_ease_both] font-display text-[2.4rem] font-medium leading-[1.02] tracking-[-0.03em] text-dark sm:text-[clamp(2.75rem,4.8vw,4.1rem)]"
          style="animation-delay: 0.15s"
        >
          Attachment style test<br>
          for the way you <em class="italic text-terra">love.</em>
        </h1>

        <p
          class="mb-8 max-w-[500px] animate-[fade-up_.6s_ease_both] text-[1.0625rem] leading-[1.72] text-body"
          style="animation-delay: 0.25s"
        >
          Take a 25-question attachment style test grounded in attachment theory. Learn whether
          your pattern is secure, anxious, avoidant, or fearful-avoidant - and what that means for
          closeness, conflict, and communication.
        </p>

        <div
          class="mb-11 flex animate-[fade-up_.6s_ease_both] flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5"
          style="animation-delay: 0.35s"
        >
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Start the free test" />
          <span class="text-[0.8125rem] text-pale">
            25 questions &middot; about 4 minutes
          </span>
        </div>

        <div
          class="flex animate-[fade-up_.6s_ease_both] flex-wrap items-center gap-4 sm:gap-6"
          style="animation-delay: 0.45s"
        >
          <template v-for="(stat, index) in heroStats" :key="stat.label">
            <div class="flex flex-col gap-[2px]">
              <b class="text-lg font-medium tracking-[-0.01em] text-dark">{{ stat.value }}</b>
              <span class="text-xs text-pale">{{ stat.label }}</span>
            </div>
            <div v-if="index < heroStats.length - 1" class="hidden h-7 w-px bg-border sm:block" />
          </template>
        </div>
      </header>

      <div
        aria-hidden="true"
        class="flex w-full animate-[fade-up_.8s_ease_both] justify-center lg:w-[340px] lg:shrink-0"
        style="animation-delay: 0.3s"
      >
        <div class="relative h-[460px] w-[320px] origin-top scale-[0.88] sm:scale-100">
          <div
            class="absolute top-2 -left-2 z-[1] w-[252px] rounded-[18px] border border-secure-bd bg-secure-bg p-[22px] opacity-65"
            style="transform: rotate(-7.5deg)"
          >
            <p class="mb-[14px] font-display text-base font-medium text-dark">Secure</p>
            <div class="flex flex-col gap-[7px]">
              <div class="h-[7px] overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[78%] rounded-full bg-secure" />
              </div>
              <div class="h-[7px] overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[55%] rounded-full bg-secure opacity-45" />
              </div>
              <div class="h-[7px] overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[88%] rounded-full bg-secure opacity-25" />
              </div>
            </div>
          </div>

          <div
            class="absolute top-7 -right-0.5 z-[2] w-[252px] rounded-[18px] border border-anxious-bd bg-anxious-bg p-[22px] opacity-80"
            style="transform: rotate(5.5deg)"
          >
            <p class="mb-[14px] font-display text-base font-medium text-dark">Anxious</p>
            <div class="flex flex-col gap-[7px]">
              <div class="h-[7px] overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[82%] rounded-full bg-anxious" />
              </div>
              <div class="h-[7px] overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[44%] rounded-full bg-anxious opacity-45" />
              </div>
              <div class="h-[7px] overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[70%] rounded-full bg-anxious opacity-25" />
              </div>
            </div>
          </div>

          <div
            class="absolute bottom-0 left-1/2 z-[3] w-[306px] animate-[float-card_5s_ease-in-out_1s_infinite] rounded-[18px] border border-border bg-white p-[22px] shadow-floating-card"
            style="transform: translateX(-50%) rotate(-1.5deg)"
          >
            <div class="mb-[14px] flex items-center justify-between">
              <span class="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-pale">
                Example result
              </span>
              <span class="rounded-full bg-avoid-bg px-3 py-1 text-[0.8125rem] font-medium text-avoid">
                Avoidant
              </span>
            </div>

            <p class="mb-4 text-[0.8125rem] leading-[1.65] text-body">
              You value independence and can pull back when closeness feels intense. The full
              result explains the triggers behind that response and what more secure connection can
              look like.
            </p>

            <div class="mb-[14px] flex items-center gap-[10px]">
              <div class="h-[6px] flex-1 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[72%] rounded-full bg-avoid" />
              </div>
              <span class="whitespace-nowrap text-xs text-muted">Top pattern</span>
            </div>

            <div class="flex flex-wrap gap-[6px]">
              <span class="rounded-full bg-fearful-bg px-[10px] py-1 text-[0.6875rem] text-muted">
                Autonomy
              </span>
              <span class="rounded-full bg-fearful-bg px-[10px] py-1 text-[0.6875rem] text-muted">
                Distance
              </span>
              <span class="rounded-full bg-fearful-bg px-[10px] py-1 text-[0.6875rem] text-muted">
                Guarded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
