<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'
import { attachmentStyleCards, landingPrimaryActionHref } from '~/data/landing'
</script>

<template>
  <section id="types" aria-labelledby="types-heading" class="landing-section bg-sec-bg">
    <div class="landing-container">
      <header class="mb-10 max-w-160 sm:mb-14">
        <p class="landing-section-kicker">
          The four styles
        </p>
        <h2 id="types-heading" class="landing-section-title">
          The four attachment styles.<br>
          Which one feels most familiar?
        </h2>
        <p class="landing-section-copy max-w-125">
          Attachment style describes how you tend to handle closeness, distance, and emotional
          safety. These four patterns come from attachment theory and help put familiar
          relationship reactions into words.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in attachmentStyleCards"
          :key="card.title"
          class="flex flex-col gap-2 rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated-card sm:p-7.5"
          :class="card.surfaceClass"
        >
          <span class="text-xs text-soft-muted">{{ card.eyebrow }}</span>
          <h3
            class="my-1 font-display text-3xl leading-none font-medium tracking-tight"
            :class="card.accentClass"
          >
            {{ card.title }}
          </h3>
          <p class="text-xs font-medium leading-5 text-dark2">{{ card.summary }}</p>
          <p class="mt-1 flex-1 text-sm leading-6 text-body">{{ card.description }}</p>
          <NuxtLink
            :to="card.href"
            class="mt-3 inline-block text-sm font-medium transition-opacity duration-200 hover:opacity-65"
            :class="card.accentClass"
          >
            Learn more &rarr;
          </NuxtLink>
        </article>
      </div>

      <div class="mt-10 flex flex-wrap items-center gap-5 sm:mt-14">
        <AppButton :href="landingPrimaryActionHref" label="Find your style - it's free" show-arrow />
      </div>
    </div>
  </section>
</template>
