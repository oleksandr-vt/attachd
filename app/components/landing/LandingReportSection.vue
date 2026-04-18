<script setup lang="ts">
import { landingPrimaryActionHref, reportChecklist } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section class="bg-sec-bg px-8 py-24 max-[600px]:px-5 max-[600px]:py-[72px]">
    <div
      class="mx-auto flex max-w-[1160px] items-center gap-20 max-[1080px]:gap-12 max-[860px]:flex-col max-[860px]:gap-10"
    >
      <div class="min-w-0 flex-1">
        <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra">
          Full in-depth report
        </p>
        <h2
          class="mb-[1.125rem] font-playfair text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-dark"
        >
          Go deeper than<br>
          a result label.
        </h2>
        <p class="mb-8 max-w-[500px] text-[1.0625rem] leading-[1.72] text-body">
          The premium report is a 15-page deep dive into your attachment patterns - why they
          formed, how they show up, and your personalised roadmap toward growth.
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

        <div class="flex items-center gap-5 flex-wrap">
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Start the free test" />
          <span class="text-[0.8125rem] text-pale">Free test &middot; $9 for the full report</span>
        </div>
      </div>

      <div class="shrink-0 max-[860px]:flex max-[860px]:w-full max-[860px]:justify-center">
        <div
          class="w-[300px] overflow-hidden rounded-[18px] border border-border bg-white shadow-report-card max-[860px]:w-full max-[860px]:max-w-[360px]"
        >
          <div class="flex items-center gap-[6px] border-b border-border bg-cream px-4 py-3">
            <span class="block h-[10px] w-[10px] rounded-full bg-border" />
            <span class="block h-[10px] w-[10px] rounded-full bg-border" />
            <span class="block h-[10px] w-[10px] rounded-full bg-border" />
          </div>

          <div class="p-6">
            <p class="mb-[6px] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-terra">
              Your attachment report
            </p>
            <h3 class="mb-5 font-playfair text-[1.75rem] font-medium text-dark">Avoidant</h3>

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
