<script setup lang="ts">
import { heroStats, landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section
    id="hero"
    class="overflow-hidden bg-cream px-8 pb-24 pt-[128px] max-[600px]:px-5 max-[600px]:pb-[72px] max-[600px]:pt-[100px]"
    :style="{
      backgroundImage:
        'radial-gradient(ellipse 600px 400px at 70% 50%, var(--landing-hero-glow) 0%, transparent 70%)',
    }"
  >
    <div class="mx-auto flex max-w-[1160px] items-center gap-20 max-[860px]:flex-col max-[860px]:gap-12">
      <div class="min-w-0 flex-1">
        <p
          class="mb-[1.125rem] block animate-[fade-up_.6s_ease_both] text-xs font-medium uppercase tracking-[0.12em] text-terra"
          style="animation-delay: 0.05s"
        >
          Attachment Style Assessment
        </p>

        <h1
          class="mb-6 animate-[fade-up_.6s_ease_both] font-playfair text-[clamp(3rem,5.5vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.025em] text-dark max-[600px]:text-[2.75rem]"
          style="animation-delay: 0.15s"
        >
          Find out why<br>
          you love the<br>
          <em class="italic text-terra">way you do.</em>
        </h1>

        <p
          class="mb-8 max-w-[500px] animate-[fade-up_.6s_ease_both] text-[1.0625rem] leading-[1.72] text-body"
          style="animation-delay: 0.25s"
        >
          A science-backed 4-minute test used by over 500,000 people. Understand the patterns
          running your relationships - and finally make sense of them.
        </p>

        <div
          class="mb-11 flex animate-[fade-up_.6s_ease_both] items-center gap-5 flex-wrap"
          style="animation-delay: 0.35s"
        >
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Take the free test" />
          <span class="text-[0.8125rem] text-pale">
            25 questions &middot; 4 minutes &middot; No sign-up needed
          </span>
        </div>

        <div
          class="flex animate-[fade-up_.6s_ease_both] items-center gap-6"
          style="animation-delay: 0.45s"
        >
          <template v-for="(stat, index) in heroStats" :key="stat.label">
            <div class="flex flex-col gap-[2px]">
              <b class="text-lg font-medium tracking-[-0.01em] text-dark">
                {{ stat.value }}
                <span v-if="stat.icon === 'star'" aria-hidden="true">&#9733;</span>
              </b>
              <span class="text-xs text-pale">{{ stat.label }}</span>
            </div>
            <div v-if="index < heroStats.length - 1" class="h-7 w-px bg-border" />
          </template>
        </div>
      </div>

      <div
        aria-hidden="true"
        class="w-[340px] shrink-0 animate-[fade-up_.8s_ease_both] max-[860px]:flex max-[860px]:w-full max-[860px]:justify-center"
        style="animation-delay: 0.3s"
      >
        <div class="relative h-[460px] w-[320px] max-[600px]:origin-top max-[600px]:scale-[0.88]">
          <div
            class="absolute top-2 -left-2 z-[1] w-[252px] rounded-[18px] border border-secure-bd bg-secure-bg p-[22px] opacity-65"
            style="transform: rotate(-7.5deg)"
          >
            <p class="mb-[14px] font-playfair text-base font-medium text-dark">Secure</p>
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
            <p class="mb-[14px] font-playfair text-base font-medium text-dark">Anxious</p>
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
                Your result
              </span>
              <span class="rounded-full bg-avoid-bg px-3 py-1 text-[0.8125rem] font-medium text-avoid">
                Avoidant
              </span>
            </div>

            <p class="mb-4 text-[0.8125rem] leading-[1.65] text-body">
              You value independence deeply. Emotional demands can feel suffocating - but
              connection is something you secretly crave.
            </p>

            <div class="mb-[14px] flex items-center gap-[10px]">
              <div class="h-[6px] flex-1 overflow-hidden rounded-full bg-bar-bg">
                <div class="h-full w-[72%] rounded-full bg-avoid" />
              </div>
              <span class="whitespace-nowrap text-xs text-muted">72% match</span>
            </div>

            <div class="flex flex-wrap gap-[6px]">
              <span class="rounded-full bg-fearful-bg px-[10px] py-1 text-[0.6875rem] text-muted">
                Self-reliant
              </span>
              <span class="rounded-full bg-fearful-bg px-[10px] py-1 text-[0.6875rem] text-muted">
                Guarded
              </span>
              <span class="rounded-full bg-fearful-bg px-[10px] py-1 text-[0.6875rem] text-muted">
                Introspective
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
