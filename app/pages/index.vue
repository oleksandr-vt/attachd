<template>
  <div>
    <LandingHeroSection />
    <LandingTypesSection />
    <LandingHowItWorksSection />
    <LandingBenefitsSection />
    <LandingCouplesSection />
    <LandingReportSection />
    <LandingFaqSection />
    <LandingFinalCtaSection />
  </div>
</template>

<script setup lang="ts">
import { faqItems } from '~/data/landing'
import LandingBenefitsSection from '~/components/landing/LandingBenefitsSection.vue'
import LandingCouplesSection from '~/components/landing/LandingCouplesSection.vue'
import LandingFaqSection from '~/components/landing/LandingFaqSection.vue'
import LandingFinalCtaSection from '~/components/landing/LandingFinalCtaSection.vue'
import LandingHeroSection from '~/components/landing/LandingHeroSection.vue'
import LandingHowItWorksSection from '~/components/landing/LandingHowItWorksSection.vue'
import LandingReportSection from '~/components/landing/LandingReportSection.vue'
import LandingTypesSection from '~/components/landing/LandingTypesSection.vue'
import { useCanonicalUrl } from '~/composables/useSiteOrigin'

const canonicalUrl = useCanonicalUrl()
const pageTitle = 'Attachment Style Test'
const pageDescription =
  'Take a 25-question attachment style test to learn whether your relationship pattern is secure, anxious, avoidant, or fearful-avoidant, then open a personalized result you can revisit or share.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: `${pageTitle} | Attachd.`,
  ogDescription: pageDescription,
  ogType: 'website',
  ogSiteName: 'Attachd.',
  twitterCard: 'summary',
  twitterTitle: `${pageTitle} | Attachd.`,
  twitterDescription: pageDescription,
  robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }),
    },
  ],
})
</script>
