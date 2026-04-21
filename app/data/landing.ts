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

export type ReportPreviewSlide = {
  title: string
  summary: string
  primaryPattern: string
  coreFear: string
  growthEdge: string
  progress: number
  badgeClass: string
  surfaceClass: string
  borderClass: string
  accentClass: string
  barClass: string
}

export const landingBrandName = 'attachd.'

export const landingPrimaryActionHref = '/test/attachment'
export const landingCouplesActionHref = '/couples'

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
    href: '/results/secure',
  },
  {
    eyebrow: 'Closeness-seeking',
    title: 'Anxious',
    summary: 'Craving closeness, fearing abandonment',
    description:
      'You may read distance as danger and look for extra reassurance when connection feels uncertain or inconsistent.',
    surfaceClass: 'bg-anxious-bg border-anxious-bd',
    accentClass: 'text-anxious',
    href: '/results/anxious',
  },
  {
    eyebrow: 'Self-protective',
    title: 'Avoidant',
    summary: 'Fiercely independent, emotionally guarded',
    description:
      'You often protect yourself through self-reliance, especially when a relationship starts to feel emotionally demanding.',
    surfaceClass: 'bg-avoid-bg border-avoid-bd',
    accentClass: 'text-avoid',
    href: '/results/avoidant',
  },
  {
    eyebrow: 'Push-pull pattern',
    title: 'Fearful-Avoidant',
    summary: 'Wanting love, terrified of it too',
    description:
      'You can want closeness deeply and still pull back when trust, vulnerability, or rejection feel risky.',
    surfaceClass: 'bg-fearful-bg border-fearful-bd',
    accentClass: 'text-fearful',
    href: '/results/fearful-avoidant',
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
    title: 'Open your personalized result',
    description:
      'After the last question, add your email to open a saved result page you can revisit and share.',
  },
  {
    number: '03',
    title: 'See your primary attachment style',
    description:
      'You get your attachment style, a more personal read of your patterns, and clear next steps in one clean result page.',
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

export const reportPreviewSlides: ReportPreviewSlide[] = [
  {
    title: 'Avoidant',
    summary: 'Self-protective and independence-first under emotional pressure.',
    primaryPattern: 'Emotional deactivation under intimacy pressure',
    coreFear: 'Loss of autonomy and being overwhelmed',
    growthEdge: 'Tolerating vulnerability without withdrawal',
    progress: 38,
    badgeClass: 'bg-avoid-soft text-avoid',
    surfaceClass: 'bg-avoid-bg',
    borderClass: 'border-avoid-bd',
    accentClass: 'text-avoid',
    barClass: 'bg-avoid',
  },
  {
    title: 'Anxious',
    summary: 'Connection-seeking, hyper-alert, and quick to read distance as threat.',
    primaryPattern: 'Protest behavior when reassurance feels inconsistent',
    coreFear: 'Abandonment and emotional unpredictability',
    growthEdge: 'Self-soothing before escalating for closeness',
    progress: 57,
    badgeClass: 'bg-anxious-soft text-anxious',
    surfaceClass: 'bg-anxious-bg',
    borderClass: 'border-anxious-bd',
    accentClass: 'text-anxious',
    barClass: 'bg-anxious',
  },
  {
    title: 'Secure',
    summary: 'Grounded, direct, and usually able to stay open through tension.',
    primaryPattern: 'Balanced closeness and independence in relationships',
    coreFear: 'Disconnection is manageable rather than defining',
    growthEdge: 'Maintaining openness while holding healthy boundaries',
    progress: 82,
    badgeClass: 'bg-secure-bg text-secure',
    surfaceClass: 'bg-secure-bg',
    borderClass: 'border-secure-bd',
    accentClass: 'text-secure',
    barClass: 'bg-secure',
  },
  {
    title: 'Fearful-Avoidant',
    summary: 'Wanting intimacy deeply while bracing for hurt or rejection.',
    primaryPattern: 'Push-pull closeness with sharp swings in trust',
    coreFear: 'Being hurt, trapped, or left after opening up',
    growthEdge: 'Building safety slowly enough to stay emotionally present',
    progress: 49,
    badgeClass: 'bg-fearful-bg text-fearful',
    surfaceClass: 'bg-fearful-bg',
    borderClass: 'border-fearful-bd',
    accentClass: 'text-fearful',
    barClass: 'bg-fearful',
  },
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
      'The test is 25 questions and is designed to take about four minutes for most people.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No account is needed to start. The test begins right away, and there is just one quick step before your personalized result opens.',
  },
  {
    question: 'What do I get after the free result?',
    answer:
      'You get your primary attachment style, a more detailed interpretation of your relationship patterns, and a result page you can revisit or share.',
  },
  {
    question: 'Is this a diagnosis or therapy?',
    answer:
      'No. The test is educational and self-reflective. It is not a diagnosis, medical advice, or a substitute for therapy or mental health care.',
  },
]
