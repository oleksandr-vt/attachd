<script setup lang="ts">
import { testimonials } from '~/data/landing'
</script>

<template>
  <section class="bg-sec-bg px-8 py-24 max-[600px]:px-5 max-[600px]:py-[72px]">
    <div class="mx-auto max-w-[1160px]">
      <div class="grid grid-cols-3 gap-6 max-[860px]:grid-cols-1">
        <blockquote
          v-for="testimonial in testimonials"
          :key="testimonial.author"
          class="flex flex-col gap-5 rounded-[18px] border border-border bg-cream p-8"
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
