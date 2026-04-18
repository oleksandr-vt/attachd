<script setup lang="ts">
import { testimonials } from '~/data/landing'
</script>

<template>
  <section class="landing-section bg-sec-bg">
    <div class="landing-container">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <blockquote
          v-for="testimonial in testimonials"
          :key="testimonial.author"
          class="flex flex-col gap-5 rounded-[18px] border border-border bg-cream p-6 sm:p-8"
        >
          <p class="flex-1 font-playfair text-base leading-[1.7] italic text-dark2">
            "{{ testimonial.quote }}"
          </p>
          <footer class="flex items-center justify-between border-t border-border pt-4">
            <span class="text-sm font-medium text-dark">{{ testimonial.author }}</span>
            <span class="text-xs font-medium text-terra">{{ testimonial.tag }}</span>
          </footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>
