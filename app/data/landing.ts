export type LandingLink = {
  label: string
  href: string
}

export type HeroStat = {
  value: string
  label: string
  icon?: 'star'
}

export type AttachmentStyleCard = {
  prevalence: string
  title: string
  summary: string
  description: string
  surfaceClass: string
  accentClass: string
  href: string
}

export type ProcessStep = {
  number: string
  title: string
  description: string
}

export type Testimonial = {
  quote: string
  author: string
  tag: string
}

export const landingBrandName = 'attachd.'

export const landingPrimaryActionHref = '/#hero'

export const landingNavLinks: LandingLink[] = [
  { label: 'The styles', href: '/#types' },
  { label: 'How it works', href: '/#how' },
  { label: 'For couples', href: '/#couples' },
]

export const landingFooterLinks: LandingLink[] = [
  { label: 'Privacy', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact', href: '#' },
]

export const heroStats: HeroStat[] = [
  { value: '500k+', label: 'tests taken' },
  { value: '94%', label: "say it's accurate" },
  { value: '4.9', label: 'average rating', icon: 'star' },
]

export const attachmentStyleCards: AttachmentStyleCard[] = [
  {
    prevalence: '~35% of people',
    title: 'Secure',
    summary: 'Comfortable with closeness and independence',
    description:
      'You trust easily, communicate openly, and feel grounded in relationships. Love feels nourishing, not destabilising.',
    surfaceClass: 'bg-secure-bg border-secure-bd',
    accentClass: 'text-secure',
    href: '/#types',
  },
  {
    prevalence: '~20% of people',
    title: 'Anxious',
    summary: 'Craving closeness, fearing abandonment',
    description:
      'You love deeply and feel intensely. When connection feels threatened, anxiety spirals into a need for constant reassurance.',
    surfaceClass: 'bg-anxious-bg border-anxious-bd',
    accentClass: 'text-anxious',
    href: '/#types',
  },
  {
    prevalence: '~25% of people',
    title: 'Avoidant',
    summary: 'Fiercely independent, emotionally guarded',
    description:
      'Self-sufficiency is your default. Intimacy can feel suffocating - but beneath the distance, connection is what you truly want.',
    surfaceClass: 'bg-avoid-bg border-avoid-bd',
    accentClass: 'text-avoid',
    href: '/#types',
  },
  {
    prevalence: '~20% of people',
    title: 'Fearful-Avoidant',
    summary: 'Wanting love, terrified of it too',
    description:
      'You crave deep connection but fear both intimacy and rejection. This push-pull creates confusing patterns in your closest relationships.',
    surfaceClass: 'bg-fearful-bg border-fearful-bd',
    accentClass: 'text-fearful',
    href: '/#types',
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: '25 situational questions',
    description:
      "Each question puts you in a real relationship moment and asks how you'd actually feel - not how you think you should.",
  },
  {
    number: '02',
    title: 'Instant, private results',
    description:
      'Your attachment type appears immediately. Enter your email to receive your full in-depth report - yours to keep forever.',
  },
  {
    number: '03',
    title: 'A real growth roadmap',
    description:
      'Every result includes your triggers, strengths, conflict patterns, and concrete steps toward more secure attachment.',
  },
]

export const testimonials: Testimonial[] = [
  {
    quote:
      "I finally understand why I keep pushing people away. This changed how I see every relationship I've ever had.",
    author: 'Maya R.',
    tag: 'Avoidant',
  },
  {
    quote:
      'My therapist had been explaining this for months. Four minutes on this site and it finally clicked.',
    author: 'James K.',
    tag: 'Anxious',
  },
  {
    quote:
      "We took it together as a couple. Understanding each other's styles completely transformed how we fight.",
    author: 'Sofia & Tom',
    tag: 'Couples report',
  },
]

export const couplesChecklist = [
  'Why you trigger each other',
  'Your core conflict loop',
  "How to meet each other's needs",
  'Your unique compatibility strengths',
]

export const reportChecklist = [
  'Your attachment origin story',
  'Your 5 core triggers, explained',
  'How you behave in conflict',
  'What secure attachment looks like for you',
  'Exercises to rewire your patterns',
]
