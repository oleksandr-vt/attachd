<script setup lang="ts">
import { landingPrimaryActionHref, reportChecklist } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="report" aria-labelledby="report-heading" class="landing-section bg-sec-bg">
    <div class="landing-container flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-20">
      <header class="min-w-0 flex-1">
        <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra">
          Full in-depth report
        </p>
        <h2
          id="report-heading"
          class="mb-[1.125rem] font-display text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em] text-dark"
        >
          Go beyond the label.
        </h2>
        <p class="mb-8 max-w-[500px] text-[1.0625rem] leading-[1.72] text-body">
          The premium report is a 15-page PDF that explains how your pattern formed, where it shows
          up most often, and what more secure behavior can look like in real relationships.
        </p>

        <ul class="my-6 flex list-none flex-col gap-3">
          <li
            v-for="item in reportChecklist"
            :key="item"
            class="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-dark2"
          >
            <span class="text-[0.875rem] text-terra" aria-hidden="true">&rarr;</span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Start the free test" />
          <span class="text-[0.8125rem] text-pale">Free to start &middot; $9 for the 15-page report</span>
        </div>
      </header>

      <div class="flex w-full justify-center xl:w-auto xl:shrink-0">
        <div
          class="w-full max-w-[360px] overflow-hidden rounded-[18px] border border-border bg-white shadow-report-card xl:w-[300px] xl:max-w-none"
        >
          <div class="flex items-center gap-[6px] border-b border-border bg-cream px-4 py-3">
            <span class="block h-[10px] w-[10px] rounded-full bg-border" />
            <span class="block h-[10px] w-[10px] rounded-full bg-border" />
            <span class="block h-[10px] w-[10px] rounded-full bg-border" />
          </div>

          <div class="p-6">
            <p class="mb-[6px] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-terra">
              Example full report
            </p>
            <h3 class="mb-5 font-display text-[1.75rem] font-medium tracking-[-0.02em] text-dark">Avoidant</h3>

            <div class="mb-4">
              <p class="mb-[3px] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-pale">
                Primary pattern
              </p>
              <p class="text-sm leading-[1.5] text-dark2">
                Emotional deactivation under intimacy pressure
              </p>
            </div>

            <div class="mb-4">
              <p class="mb-[3px] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-pale">
                Core fear
              </p>
              <p class="text-sm leading-[1.5] text-dark2">
                Loss of autonomy and being overwhelmed
              </p>
            </div>

            <div class="mb-4">
              <p class="mb-[3px] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-pale">
                Growth edge
              </p>
              <p class="text-sm leading-[1.5] text-dark2">
                Tolerating vulnerability without withdrawal
              </p>
            </div>

            <p class="mb-2 mt-5 text-xs font-medium text-muted">Journey to secure</p>
            <div class="h-[6px] overflow-hidden rounded-full bg-bar-bg">
              <div class="h-full w-[38%] rounded-full bg-terra" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
