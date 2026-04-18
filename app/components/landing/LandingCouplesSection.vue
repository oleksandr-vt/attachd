<script setup lang="ts">
import { couplesChecklist, landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="couples" class="bg-cream px-8 py-24 max-[600px]:px-5 max-[600px]:py-[72px]">
    <div
      class="mx-auto flex max-w-[1160px] items-center gap-20 max-[1080px]:gap-12 max-[860px]:flex-col max-[860px]:gap-10"
    >
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

        <div class="flex items-center gap-5 flex-wrap">
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Get the couples report" />
          <span class="text-[0.8125rem] text-pale">$14 &middot; One-time &middot; Instant delivery</span>
        </div>
      </div>

      <div class="shrink-0 max-[860px]:w-full">
        <div
          class="min-w-[340px] rounded-[22px] border border-border bg-cream p-8 px-9 max-[860px]:w-full max-[860px]:min-w-0"
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
