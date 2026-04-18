<script setup lang="ts">
import { attachmentStyleCards, landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="types" class="landing-section bg-sec-bg">
    <div class="landing-container">
      <div class="mb-14 max-w-[600px]">
        <p class="mb-[1.125rem] block text-xs font-medium uppercase tracking-[0.12em] text-terra">
          The four styles
        </p>
        <h2
          class="mb-[1.125rem] font-playfair text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-dark"
        >
          Every pattern has a name.<br>
          Which one feels like you?
        </h2>
        <p class="max-w-[500px] text-[1.0625rem] leading-[1.72] text-body">
          Based on decades of research by Bowlby, Ainsworth, and Bartholomew. Your style formed
          early - but it can absolutely evolve.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in attachmentStyleCards"
          :key="card.title"
          class="flex flex-col gap-2 rounded-[18px] border p-[1.875rem] transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated-card"
          :class="card.surfaceClass"
        >
          <span class="text-xs text-soft-muted">{{ card.prevalence }}</span>
          <h3
            class="my-1 font-playfair text-[1.625rem] font-medium leading-none"
            :class="card.accentClass"
          >
            {{ card.title }}
          </h3>
          <p class="text-[0.8125rem] font-medium leading-[1.45] text-dark2">{{ card.summary }}</p>
          <p class="mt-1 flex-1 text-sm leading-[1.68] text-body">{{ card.description }}</p>
          <a
            :href="card.href"
            class="mt-3 inline-block text-sm font-medium transition-opacity duration-200 hover:opacity-65"
            :class="card.accentClass"
          >
            Learn more &rarr;
          </a>
        </article>
      </div>

      <div class="mt-14 flex items-center gap-5 flex-wrap">
        <LandingPrimaryButton :href="landingPrimaryActionHref" label="Find your style - it's free" />
      </div>
    </div>
  </section>
</template>
