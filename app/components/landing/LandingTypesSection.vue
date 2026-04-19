<script setup lang="ts">
import { attachmentStyleCards, landingPrimaryActionHref } from '~/data/landing'
import LandingPrimaryButton from '~/components/landing/LandingPrimaryButton.vue'
</script>

<template>
  <section id="types" aria-labelledby="types-heading" class="landing-section bg-sec-bg">
    <div class="landing-container">
      <header class="mb-14 max-w-160">
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
          class="types-card flex flex-col gap-2 border p-7.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated-card"
          :class="card.surfaceClass"
        >
          <span class="text-xs text-soft-muted">{{ card.eyebrow }}</span>
          <h3
            class="types-card-title my-1"
            :class="card.accentClass"
          >
            {{ card.title }}
          </h3>
          <p class="types-card-summary text-dark2">{{ card.summary }}</p>
          <p class="types-card-copy mt-1 flex-1 text-body">{{ card.description }}</p>
          <NuxtLink
            :to="card.href"
            class="mt-3 inline-block text-sm font-medium transition-opacity duration-200 hover:opacity-65"
            :class="card.accentClass"
          >
            Learn more &rarr;
          </NuxtLink>
        </article>
      </div>

      <div class="mt-14 flex flex-wrap items-center gap-5">
        <LandingPrimaryButton :href="landingPrimaryActionHref" label="Find your style - it's free" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.types-card {
  border-radius: 18px;
}

.types-card-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
}

.types-card-summary {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
}

.types-card-copy {
  font-size: 0.875rem;
  line-height: 1.68;
}
</style>
