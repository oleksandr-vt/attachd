<script setup lang="ts">
import { couplesChecklist, landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="couples" class="landing-section bg-cream">
    <div class="landing-container flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-20">
      <div class="min-w-0 flex-1">
        <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra">
          For couples
        </p>
        <h2
          class="mb-[1.125rem] font-playfair text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-dark"
        >
          You've done your work.<br>
          Now do it together.
        </h2>
        <p class="mb-8 max-w-[500px] text-[1.0625rem] leading-[1.72] text-body">
          The Couples Compatibility Report maps both attachment styles side-by-side - revealing why
          you clash, where you thrive, and exactly how to grow toward each other.
        </p>

        <ul class="my-6 flex list-none flex-col gap-3">
          <li
            v-for="item in couplesChecklist"
            :key="item"
            class="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-dark2"
          >
            <span class="mt-[0.35rem] text-[0.6rem] text-terra" aria-hidden="true">&#10022;</span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Get the couples report" />
          <span class="text-[0.8125rem] text-pale">$14 &middot; One-time &middot; Instant delivery</span>
        </div>
      </div>

      <div class="w-full xl:w-auto xl:shrink-0">
        <div
          class="mx-auto w-full max-w-[380px] rounded-[22px] border border-border bg-cream p-6 sm:max-w-[400px] sm:p-8 sm:px-9 xl:mx-0 xl:max-w-none"
        >
          <p class="mb-6 text-xs font-medium uppercase tracking-[0.08em] text-pale">
            Compatibility preview
          </p>

          <div class="mb-6 flex items-center gap-5">
            <div class="flex flex-col items-center gap-2">
              <div
                class="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-anxious-soft font-playfair text-[1.25rem] font-medium text-anxious"
              >
                A
              </div>
              <span
                class="whitespace-nowrap rounded-full bg-anxious-soft px-[10px] py-[3px] text-xs font-medium text-anxious"
              >
                Anxious
              </span>
            </div>

            <div class="flex flex-1 flex-col items-center gap-2">
              <span class="text-[1.125rem] text-terra" aria-hidden="true">&hearts;</span>
              <div class="h-[6px] w-full overflow-hidden rounded-full bg-border">
                <div
                  class="h-full w-[78%] rounded-full bg-[linear-gradient(90deg,var(--color-anxious),var(--color-avoid))]"
                />
              </div>
              <span class="text-center text-xs text-muted">High growth potential</span>
            </div>

            <div class="flex flex-col items-center gap-2">
              <div
                class="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-avoid-soft font-playfair text-[1.25rem] font-medium text-avoid"
              >
                B
              </div>
              <span
                class="whitespace-nowrap rounded-full bg-avoid-soft px-[10px] py-[3px] text-xs font-medium text-avoid"
              >
                Avoidant
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-[0.875rem] border-t border-border pt-5">
            <div class="flex flex-col gap-[2px]">
              <span class="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-pale">
                Clash point
              </span>
              <span class="text-sm text-dark2">Withdrawal vs. pursuit cycle</span>
            </div>
            <div class="flex flex-col gap-[2px]">
              <span class="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-pale">
                Strength
              </span>
              <span class="text-sm text-dark2">Deep loyalty when trust is built</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
