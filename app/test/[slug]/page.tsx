import type { Metadata } from 'next'
import TestRunner from '@/components/TestRunner'

export const dynamicParams = false

export const generateStaticParams = () => [{ slug: 'attachment' }]

export const metadata: Metadata = {
  title: 'Attachment Style Test',
  description:
    'Take the 25-question attachment style test to see whether your relationship pattern is secure, anxious, avoidant, or fearful-avoidant and get clear results.',
  alternates: { canonical: '/test/attachment' },
  openGraph: {
    title: 'Attachment Style Test | Attachd.',
    description: 'A fast 25-question attachment style test with clear results and a shareable result page.',
  },
  twitter: { card: 'summary' },
}

export default function TestPage() {
  return <TestRunner />
}
