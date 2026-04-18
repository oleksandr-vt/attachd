export type LandingLink = {
  label: string
  href: string
}

export type HeroStat = {
  value: string
  label: string
}

export type AttachmentStyleCard = {
  eyebrow: string
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

export type BenefitCard = {
  eyebrow: string
  title: string
  description: string
}

export type FaqItem = {
  question: string
  answer: string
}

export const landingBrandName = 'attachd.'

export const landingPrimaryActionHref = '/#hero'

export const landingNavLinks: LandingLink[] = [
  { label: 'Attachment styles', href: '/#types' },
  { label: 'How it works', href: '/#how' },
  { label: 'For couples', href: '/#couples' },
  { label: 'FAQ', href: '/#faq' },
]

export const landingFooterLinks: LandingLink[] = [
  { label: 'Attachment styles', href: '/#types' },
  { label: 'How it works', href: '/#how' },
  { label: 'For couples', href: '/#couples' },
  { label: 'FAQ', href: '/#faq' },
]

export const heroStats: HeroStat[] = [
  { value: '4 styles', label: 'secure, anxious, avoidant, fearful' },
  { value: '25 questions', label: 'built for a quick first result' },
  { value: 'Free result', label: 'clear first read of your pattern' },
]

export const attachmentStyleCards: AttachmentStyleCard[] = [
  {
    eyebrow: 'Steady and open',
    title: 'Secure',
    summary: 'Comfortable with closeness and independence',
    description:
      'You usually feel safe with intimacy, recover from conflict more easily, and communicate needs more directly.',
    surfaceClass: 'bg-secure-bg border-secure-bd',
    accentClass: 'text-secure',
    href: landingPrimaryActionHref,
  },
  {
    eyebrow: 'Closeness-seeking',
    title: 'Anxious',
    summary: 'Craving closeness, fearing abandonment',
    description:
      'You may read distance as danger and look for extra reassurance when connection feels uncertain or inconsistent.',
    surfaceClass: 'bg-anxious-bg border-anxious-bd',
    accentClass: 'text-anxious',
    href: landingPrimaryActionHref,
  },
  {
    eyebrow: 'Self-protective',
    title: 'Avoidant',
    summary: 'Fiercely independent, emotionally guarded',
    description:
      'You often protect yourself through self-reliance, especially when a relationship starts to feel emotionally demanding.',
    surfaceClass: 'bg-avoid-bg border-avoid-bd',
    accentClass: 'text-avoid',
    href: landingPrimaryActionHref,
  },
  {
    eyebrow: 'Push-pull pattern',
    title: 'Fearful-Avoidant',
    summary: 'Wanting love, terrified of it too',
    description:
      'You can want closeness deeply and still pull back when trust, vulnerability, or rejection feel risky.',
    surfaceClass: 'bg-fearful-bg border-fearful-bd',
    accentClass: 'text-fearful',
    href: landingPrimaryActionHref,
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Answer 25 quick questions',
    description:
      'Each prompt describes a familiar relationship moment so you respond based on what you actually do under stress, closeness, and uncertainty.',
  },
  {
    number: '02',
    title: 'See your primary attachment style',
    description:
      'You get a free result summary showing whether your pattern looks most secure, anxious, avoidant, or fearful-avoidant.',
  },
  {
    number: '03',
    title: 'Unlock the deeper breakdown',
    description:
      'Enter your email to receive the fuller result with triggers, strengths, conflict habits, and next steps toward more secure attachment.',
  },
]

export const benefitCards: BenefitCard[] = [
  {
    eyebrow: 'Free result',
    title: 'A clear label with real context',
    description:
      'The goal is not just to name your pattern, but to explain how it shapes closeness, reassurance, conflict, and emotional safety.',
  },
  {
    eyebrow: 'Built to share',
    title: 'A result people instantly recognize',
    description:
      'Attachment styles are easier to remember and talk about than abstract personality scores, which makes them useful for sharing and discussion.',
  },
  {
    eyebrow: 'Next step',
    title: 'More than a personality label',
    description:
      'The deeper breakdown focuses on your common triggers, protective habits, and the behaviors that move you toward a more secure pattern.',
  },
]

export const couplesChecklist = [
  'How your two patterns trigger each other',
  'Your most common conflict loop',
  'What helps each person feel safer',
  'Where compatibility is strongest',
]

export const reportChecklist = [
  'Core triggers and protective habits',
  'Strengths and blind spots in relationships',
  'Conflict patterns to watch for',
  'What secure attachment looks like for you',
  'Practical exercises and reflection prompts',
]

export const faqItems: FaqItem[] = [
  {
    question: 'What is an attachment style test?',
    answer:
      'It is a relationship-focused personality test designed to estimate which attachment pattern best matches how you handle closeness, reassurance, conflict, and vulnerability.',
  },
  {
    question: 'How long does the test take?',
    answer:
      'The MVP flow is 25 questions and is designed to take about four minutes for most people.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'You can start the test for free without an account. Email is only requested before the fuller result breakdown is delivered.',
  },
  {
    question: 'What do I get after the free result?',
    answer:
      'You get your primary attachment style and a short summary first, with the option to unlock a deeper breakdown and premium report afterward.',
  },
  {
    question: 'Is this a diagnosis or therapy?',
    answer:
      'No. The test is educational and self-reflective. It is not a diagnosis, medical advice, or a substitute for therapy or mental health care.',
  },
]
