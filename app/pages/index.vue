<template>
  <div>
    <LandingHeroSection />
    <LandingTypesSection />
    <LandingHowItWorksSection />
    <LandingTestimonialsSection />
    <LandingCouplesSection />
    <LandingReportSection />
    <LandingFinalCtaSection />
  </div>
</template>

<script setup lang="ts">
import LandingCouplesSection from '~/components/landing/LandingCouplesSection.vue'
import LandingFinalCtaSection from '~/components/landing/LandingFinalCtaSection.vue'
import LandingHeroSection from '~/components/landing/LandingHeroSection.vue'
import LandingHowItWorksSection from '~/components/landing/LandingHowItWorksSection.vue'
import LandingReportSection from '~/components/landing/LandingReportSection.vue'
import LandingTestimonialsSection from '~/components/landing/LandingTestimonialsSection.vue'
import LandingTypesSection from '~/components/landing/LandingTypesSection.vue'

useSeoMeta({
  title: 'Attachment Style Assessment',
  description: 'Find out why you love the way you do with a science-backed 4-minute attachment style test.',
})
</script>
