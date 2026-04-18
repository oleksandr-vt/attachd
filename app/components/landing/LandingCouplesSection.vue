<script setup lang="ts">
import { couplesChecklist, landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="couples" aria-labelledby="couples-heading" class="landing-section bg-cream">
    <div class="landing-container flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-20">
      <header class="min-w-0 flex-1">
        <p class="landing-section-kicker">
          For couples
        </p>
        <h2 id="couples-heading" class="landing-section-title">
          Understand the dynamic between both styles.
        </h2>
        <p class="landing-section-copy mb-8 max-w-125">
          The couples report compares both attachment styles side by side so you can see where
          conflict starts, what each person is protecting, and how to respond in a way that feels
          safer for both people.
        </p>

        <ul class="my-8 flex list-none flex-col gap-3">
          <li
            v-for="item in couplesChecklist"
            :key="item"
            class="landing-checklist-item"
          >
            <span class="couples-star mt-1.5 text-terra" aria-hidden="true">&#10022;</span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <LandingPrimaryButton :href="landingPrimaryActionHref" label="Get the couples report" />
          <span class="landing-action-note">$14 one-time</span>
        </div>
      </header>

      <div class="w-full xl:w-auto xl:shrink-0">
        <div
          class="couples-card mx-auto w-full max-w-95 border border-border bg-cream p-6 sm:max-w-100 sm:p-8 sm:px-9 xl:mx-0 xl:max-w-none"
        >
          <p class="couples-card-kicker mb-6 text-xs font-medium uppercase text-pale">
            Compatibility preview
          </p>

          <div class="mb-6 flex items-center gap-5">
            <div class="flex flex-col items-center gap-2">
              <div
                class="flex h-13 w-13 items-center justify-center rounded-full bg-anxious-soft font-display text-xl font-medium text-anxious"
              >
                A
              </div>
              <span
                class="whitespace-nowrap rounded-full bg-anxious-soft px-2.5 py-0.75 text-xs font-medium text-anxious"
              >
                Anxious
              </span>
            </div>

            <div class="flex flex-1 flex-col items-center gap-2">
              <span class="text-lg text-terra" aria-hidden="true">&hearts;</span>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  class="h-full rounded-full bg-linear-to-r from-anxious to-avoid"
                  style="width: 78%"
                />
              </div>
              <span class="text-center text-xs text-muted">Common tension point</span>
            </div>

            <div class="flex flex-col items-center gap-2">
              <div
                class="flex h-13 w-13 items-center justify-center rounded-full bg-avoid-soft font-display text-xl font-medium text-avoid"
              >
                B
              </div>
              <span
                class="whitespace-nowrap rounded-full bg-avoid-soft px-2.5 py-0.75 text-xs font-medium text-avoid"
              >
                Avoidant
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-3.5 border-t border-border pt-5">
            <div class="flex flex-col gap-px">
              <span class="couples-meta-label font-medium uppercase text-pale">
                Clash point
              </span>
              <span class="text-sm text-dark2">Withdrawal vs. pursuit cycle</span>
            </div>
            <div class="flex flex-col gap-px">
              <span class="couples-meta-label font-medium uppercase text-pale">
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

<style scoped>
.couples-star {
  font-size: 10px;
}

.couples-card {
  border-radius: 22px;
}

.couples-card-kicker,
.couples-meta-label {
  letter-spacing: 0.08em;
}

.couples-meta-label {
  font-size: 11px;
}
</style>
