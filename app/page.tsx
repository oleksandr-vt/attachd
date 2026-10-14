import type { Metadata } from 'next'
import LandingBenefitsSection from '@/components/landing/LandingBenefitsSection'
import LandingCouplesSection from '@/components/landing/LandingCouplesSection'
import LandingFaqSection from '@/components/landing/LandingFaqSection'
import LandingFinalCtaSection from '@/components/landing/LandingFinalCtaSection'
import LandingHeroSection from '@/components/landing/LandingHeroSection'
import LandingHowItWorksSection from '@/components/landing/LandingHowItWorksSection'
import LandingReportSection from '@/components/landing/LandingReportSection'
import LandingTypesSection from '@/components/landing/LandingTypesSection'
import JsonLd from '@/components/JsonLd'
import { faqItems } from '@/lib/data/landing'

const pageTitle = 'Attachment Style Test'
const pageDescription =
  'Take a 25-question attachment style test to learn whether your relationship pattern is secure, anxious, avoidant, or fearful-avoidant, then open a personalized result you can revisit or share.'

export const metadata: Metadata = {
  title: { absolute: `${pageTitle} | Attachd.` },
  description: pageDescription,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${pageTitle} | Attachd.`,
    description: pageDescription,
    type: 'website',
    siteName: 'Attachd.',
  },
  twitter: {
    card: 'summary',
    title: `${pageTitle} | Attachd.`,
    description: pageDescription,
  },
  robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
}

const faqJsonLd = {
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
}

export default function HomePage() {
  return (
    <div>
      <JsonLd data={faqJsonLd} />
      <LandingHeroSection />
      <LandingTypesSection />
      <LandingHowItWorksSection />
      <LandingBenefitsSection />
      <LandingCouplesSection />
      <LandingReportSection />
      <LandingFaqSection />
      <LandingFinalCtaSection />
    </div>
  )
}
