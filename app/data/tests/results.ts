import type { AttachmentStyleType } from '~/data/tests/attachment'

export type AttachmentResultContent = {
  type: AttachmentStyleType
  label: string
  eyebrow: string
  shortSummary: string
  longSummary: string
  description: string
  strengths: string[]
  watchouts: string[]
  relationshipNeeds: string[]
  growthMoves: string[]
  sharePrompt: string
  reportPromo: string
  partnerPrompt: string
  accentClass: string
  surfaceClass: string
  borderClass: string
  badgeClass: string
  barClass: string
  seoTitle: string
  seoDescription: string
}

export const attachmentResults: Record<AttachmentStyleType, AttachmentResultContent> = {
  secure: {
    type: 'secure',
    label: 'Secure',
    eyebrow: 'Steady and open',
    shortSummary: 'Comfortable with closeness, boundaries, and repair.',
    longSummary:
      'Secure attachment usually means you can let people in without losing yourself. You tend to handle intimacy and independence as compatible instead of threatening.',
    description:
      'You are generally able to trust connection, communicate needs more directly, and return to balance after friction instead of getting trapped in panic or shutdown.',
    strengths: [
      'You tend to speak more directly about what you need.',
      'You usually recover from conflict without assuming the relationship is doomed.',
      'You can hold closeness and independence at the same time.',
    ],
    watchouts: [
      'You may over-function in relationships where the other person is less steady.',
      'You can underestimate how threatening closeness feels to more protective partners.',
      'You may tolerate emotional imbalance for too long because you believe repair is possible.',
    ],
    relationshipNeeds: [
      'Consistency and mutual effort',
      'Honest communication over guessing games',
      'Enough emotional maturity to keep repair possible',
    ],
    growthMoves: [
      'Keep naming needs early instead of silently carrying the load.',
      'Choose people who can meet steadiness with steadiness.',
      'Use your security to build boundaries, not just patience.',
    ],
    sharePrompt: 'I got Secure Attachment. What did you get?',
    reportPromo: 'See the behaviors that keep your security steady under real pressure.',
    partnerPrompt: 'Send the test to your partner and compare how you each handle closeness and conflict.',
    accentClass: 'text-secure',
    surfaceClass: 'bg-secure-bg',
    borderClass: 'border-secure-bd',
    badgeClass: 'bg-secure-bd text-secure',
    barClass: 'bg-secure',
    seoTitle: 'Secure Attachment Style',
    seoDescription:
      'Learn what secure attachment looks like in relationships, conflict, emotional safety, and long-term growth.',
  },
  anxious: {
    type: 'anxious',
    label: 'Anxious',
    eyebrow: 'Closeness-seeking',
    shortSummary: 'Craving closeness and feeling unsettled by distance.',
    longSummary:
      'Anxious attachment usually shows up as strong connection-seeking plus high sensitivity to inconsistency. Distance often feels loaded long before anything is clearly wrong.',
    description:
      'You may read mixed signals quickly, look for reassurance when uncertainty spikes, and struggle to feel calm until connection feels explicit again.',
    strengths: [
      'You care deeply and usually notice emotional shifts quickly.',
      'You tend to value closeness, repair, and responsiveness.',
      'You are often willing to talk about the relationship instead of pretending nothing happened.',
    ],
    watchouts: [
      'You can over-read silence, timing, or tone when you feel unsure.',
      'Reassurance can help in the moment but still fail to create lasting calm.',
      'You may reach for protest behavior when direct needs feel too vulnerable to say plainly.',
    ],
    relationshipNeeds: [
      'Consistency instead of mixed signals',
      'Warm, direct reassurance during uncertainty',
      'Repair that feels timely and emotionally clear',
    ],
    growthMoves: [
      'Pause your body before chasing certainty with a spiral.',
      'Ask directly for reassurance instead of testing for it.',
      'Build self-trust so distance does not automatically mean danger.',
    ],
    sharePrompt: 'I got Anxious Attachment. What did you get?',
    reportPromo: 'See the triggers, protest patterns, and stabilizers that matter most for you.',
    partnerPrompt: 'A partner comparison can show where pursuit starts and how to slow the loop down.',
    accentClass: 'text-anxious',
    surfaceClass: 'bg-anxious-bg',
    borderClass: 'border-anxious-bd',
    badgeClass: 'bg-anxious-soft text-anxious',
    barClass: 'bg-anxious',
    seoTitle: 'Anxious Attachment Style',
    seoDescription:
      'Understand anxious attachment, why reassurance feels so central, and what helps create more security in relationships.',
  },
  avoidant: {
    type: 'avoidant',
    label: 'Avoidant',
    eyebrow: 'Self-protective',
    shortSummary: 'Independent, guarded, and quick to create distance under pressure.',
    longSummary:
      'Avoidant attachment usually protects itself through self-reliance. Closeness can feel good until it starts to carry pressure, expectation, or a sense of losing control.',
    description:
      'You may cope by minimizing needs, creating space, or going quiet when emotional intensity rises, especially if vulnerability feels exposing or overwhelming.',
    strengths: [
      'You are often calm, capable, and strongly self-directed.',
      'You can think clearly under pressure when others become reactive.',
      'You usually respect autonomy and value personal responsibility.',
    ],
    watchouts: [
      'You can pull away right when openness matters most.',
      'Your need for space can land as rejection if it is not named clearly.',
      'You may underestimate how much you still need closeness and support.',
    ],
    relationshipNeeds: [
      'Autonomy that does not require emotional disappearance',
      'Low-pressure honesty instead of forced vulnerability',
      'Partners who respect pacing without rewarding withdrawal',
    ],
    growthMoves: [
      'Name the need for space before you shut down completely.',
      'Share one real feeling earlier than feels natural.',
      'Practice staying present through small doses of discomfort.',
    ],
    sharePrompt: 'I got Avoidant Attachment. What did you get?',
    reportPromo: 'See the hidden triggers behind withdrawal and what secure openness can look like for you.',
    partnerPrompt: 'A couples breakdown can map the exact pursuit-withdrawal cycle you tend to fall into.',
    accentClass: 'text-avoid',
    surfaceClass: 'bg-avoid-bg',
    borderClass: 'border-avoid-bd',
    badgeClass: 'bg-avoid-soft text-avoid',
    barClass: 'bg-avoid',
    seoTitle: 'Avoidant Attachment Style',
    seoDescription:
      'Learn how avoidant attachment shapes intimacy, space, vulnerability, and conflict in close relationships.',
  },
  'fearful-avoidant': {
    type: 'fearful-avoidant',
    label: 'Fearful-Avoidant',
    eyebrow: 'Push-pull pattern',
    shortSummary: 'Wanting closeness deeply while bracing for pain, rejection, or overwhelm.',
    longSummary:
      'Fearful-avoidant attachment often feels like a push-pull system. You may want love and safety intensely while also expecting closeness to become dangerous, disappointing, or too much.',
    description:
      'That can create fast shifts between pursuit and withdrawal, longing and shutdown, hope and self-protection, especially when trust feels uncertain.',
    strengths: [
      'You often feel deeply, notice nuance, and care about emotional truth.',
      'You can be highly perceptive about whether connection feels real or performative.',
      'You usually want depth, not surface-level closeness.',
    ],
    watchouts: [
      'Your system can swing between urgency and retreat very quickly.',
      'You may confuse danger with intimacy itself when vulnerability spikes.',
      'Mixed signals can become self-fulfilling if fear drives both pursuit and disappearance.',
    ],
    relationshipNeeds: [
      'Steady safety over intensity',
      'Clear repair after ruptures',
      'Pacing that lets trust build without emotional whiplash',
    ],
    growthMoves: [
      'Slow the pace when the system wants to lurch forward or shut down.',
      'Name fear before acting from it.',
      'Build trust through repeated small moments of dependable closeness.',
    ],
    sharePrompt: 'I got Fearful-Avoidant Attachment. What did you get?',
    reportPromo: 'Get a clearer map of your push-pull triggers, protective reflexes, and secure next steps.',
    partnerPrompt: 'A partner comparison can reveal where fear, pursuit, and distance keep crossing wires.',
    accentClass: 'text-fearful',
    surfaceClass: 'bg-fearful-bg',
    borderClass: 'border-fearful-bd',
    badgeClass: 'bg-fearful-bd text-fearful',
    barClass: 'bg-fearful',
    seoTitle: 'Fearful-Avoidant Attachment Style',
    seoDescription:
      'Understand fearful-avoidant attachment, including push-pull dynamics, trust, intimacy, and growth toward security.',
  },
}
