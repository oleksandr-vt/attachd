import { attachmentResults } from '../../lib/data/tests/results'
import {
  attachmentStyleTypes,
  type AttachmentStyleType,
} from '../../lib/data/tests/attachment'
import type {
  AttachmentComputedResult,
  AttachmentDimensionKey,
  AttachmentTriggerKey,
  AttachmentTriggerProfile,
} from './scoring'

type CouplesPairTemplate = {
  dynamicLabel: string
  overview: string
  frictionSummary: string
  strengthSummary: string
  repairSummary: string
}

export type AttachmentCouplesProfileSummary = {
  type: AttachmentStyleType
  label: string
  eyebrow: string
  badgeClass: string
  surfaceClass: string
  borderClass: string
  subprofileLabel: string
  subprofileSummary: string
  relationshipNeeds: string[]
  strongestTriggers: string[]
  firstNextStep: string
}

export type AttachmentCouplesReport = {
  dynamicLabel: string
  overview: string
  frictionSummary: string
  strengthSummary: string
  repairSummary: string
  triggerSummary: string
  repairMoves: string[]
  sharedThemes: string[]
  profiles: [AttachmentCouplesProfileSummary, AttachmentCouplesProfileSummary]
}

const pairTemplates: Record<string, CouplesPairTemplate> = {
  'secure|secure': {
    dynamicLabel: 'Steady and repair-friendly',
    overview:
      'Both people are more likely to treat closeness and independence as compatible, which makes repair easier when tension shows up.',
    frictionSummary:
      'The main risk is not chaos but drift: assuming things are fine for too long, or letting one person quietly carry more of the emotional load.',
    strengthSummary:
      'There is usually enough steadiness here for direct conversations, workable boundaries, and faster recovery after conflict.',
    repairSummary:
      'Keep repair early and explicit so steadiness turns into clarity instead of quiet over-functioning.',
  },
  'secure|anxious': {
    dynamicLabel: 'Reassurance and steadiness gap',
    overview:
      'One partner is likely to seek more explicit closeness under stress while the other can access steadier regulation more quickly.',
    frictionSummary:
      'Distance or slow repair can feel larger to the anxious partner than it does to the secure partner, especially when reassurance stays implied instead of spoken.',
    strengthSummary:
      'This pairing can work well when the secure partner stays direct and the anxious partner asks clearly instead of escalating for certainty.',
    repairSummary:
      'Use warm, concrete reassurance and make needs explicit before anxiety has to chase for proof.',
  },
  'secure|avoidant': {
    dynamicLabel: 'Closeness and space pacing gap',
    overview:
      'The relationship can feel calmer than average, but the pacing of intimacy often matters because one partner needs more room when pressure rises.',
    frictionSummary:
      'The avoidant partner may pull back just when the secure partner expects more openness, while the secure partner may over-accommodate instead of naming the gap.',
    strengthSummary:
      'There is often less drama here, plus more respect for autonomy than in more reactive pairings.',
    repairSummary:
      'Name space without disappearing and treat pacing as a topic to coordinate, not a silent test.',
  },
  'secure|fearful-avoidant': {
    dynamicLabel: 'Safety and volatility balancing',
    overview:
      'One partner can often provide steadier repair while the other may swing more sharply between wanting closeness and protecting against it.',
    frictionSummary:
      'The fearful-avoidant partner can feel soothed by closeness one moment and threatened by it the next, which can confuse both people if the shift stays unnamed.',
    strengthSummary:
      'This pairing has a real chance to build trust because one person can help keep the floor stable while the other practices staying present.',
    repairSummary:
      'Slow the pace after emotional spikes and make follow-through more important than intensity.',
  },
  'anxious|anxious': {
    dynamicLabel: 'Amplified reassurance loop',
    overview:
      'Both partners care strongly about connection and can react quickly when closeness feels uncertain, inconsistent, or delayed.',
    frictionSummary:
      'Small gaps can escalate fast because both systems are scanning for proof that the bond is still safe.',
    strengthSummary:
      'The upside is that both people usually value repair, closeness, and emotional responsiveness instead of avoiding the conversation.',
    repairSummary:
      'Create faster repair signals after conflict and keep reassurance direct so neither person has to guess.',
  },
  'anxious|avoidant': {
    dynamicLabel: 'Pursuit and withdrawal loop',
    overview:
      'This is the classic one-person-reaches, one-person-pulls-back pattern when stress is high.',
    frictionSummary:
      'The more the anxious partner pushes for signal, the more the avoidant partner can feel pressure and protect with distance, which then spikes the anxious partner further.',
    strengthSummary:
      'When both people feel safe, this pairing can still hold loyalty, care, and a surprisingly strong complement of emotional range and independence.',
    repairSummary:
      'Replace ambiguous distance with named space, a reconnect time, and one direct reassurance statement.',
  },
  'anxious|fearful-avoidant': {
    dynamicLabel: 'Intensity and fear loop',
    overview:
      'Both people can want closeness quickly, but fear and uncertainty can scramble the signal before trust settles.',
    frictionSummary:
      'The relationship can lurch between urgency and confusion when one or both partners start reaching for certainty from an activated state.',
    strengthSummary:
      'There is often deep emotional intensity here, plus a genuine desire for closeness, honesty, and meaningful repair.',
    repairSummary:
      'Slow the pace, shorten the conflict loop, and keep reassurance tied to clear follow-through.',
  },
  'avoidant|avoidant': {
    dynamicLabel: 'Parallel distance system',
    overview:
      'Both partners are more likely to protect themselves through space, self-reliance, or quieter emotional processing.',
    frictionSummary:
      'The relationship can look calm while important things stay unspoken, especially after conflict or vulnerability spikes.',
    strengthSummary:
      'Autonomy is usually respected here, which can reduce feelings of engulfment and allow each person to breathe.',
    repairSummary:
      'Use check-ins on purpose and say what is happening before silence turns into disconnection.',
  },
  'avoidant|fearful-avoidant': {
    dynamicLabel: 'Guarded and mixed-signal loop',
    overview:
      'One partner may withdraw more consistently while the other can alternate between reaching for closeness and retreating from it.',
    frictionSummary:
      'That mismatch can make the relationship feel emotionally slippery: one person goes quiet, the other reacts hard, then both lose clarity.',
    strengthSummary:
      'This pairing often benefits from pacing and honesty because neither person does well with forced intensity or vague pressure.',
    repairSummary:
      'State limits and needs plainly, and make reconnection concrete so both people know where they stand.',
  },
  'fearful-avoidant|fearful-avoidant': {
    dynamicLabel: 'High-voltage push-pull',
    overview:
      'Both partners may want depth intensely while also bracing for hurt, rejection, or overwhelm once intimacy becomes real.',
    frictionSummary:
      'The bond can feel magnetic and destabilizing at the same time, with fast shifts between pursuit, shutdown, and fear.',
    strengthSummary:
      'The upside is strong emotional depth, high sensitivity to what is real, and a serious desire for meaningful connection.',
    repairSummary:
      'Keep the pace slower than the chemistry suggests and return to short, predictable repair routines when activation rises.',
  },
}

const triggerLabels: Record<AttachmentTriggerKey, string> = {
  'distance-alarm': 'distance alarm',
  'conflict-spiral': 'conflict spiral',
  'space-protection': 'space protection',
  'emotional-shutdown': 'emotional shutdown',
  'push-pull': 'push-pull intensity',
}

const styleOrder = attachmentStyleTypes

const getPairKey = (left: AttachmentStyleType, right: AttachmentStyleType) =>
  [left, right]
    .sort((first, second) => styleOrder.indexOf(first) - styleOrder.indexOf(second))
    .join('|')

const getDimensionPercentage = (
  result: AttachmentComputedResult,
  key: AttachmentDimensionKey,
) => result.dimensions.find((dimension) => dimension.key === key)?.percentage ?? 0

const getTriggerKeys = (result: AttachmentComputedResult) =>
  result.strongestTriggers.map((trigger) => trigger.key)

const hasTriggerKey = (result: AttachmentComputedResult, key: AttachmentTriggerKey) =>
  getTriggerKeys(result).includes(key)

const hasProtectiveSpacePattern = (result: AttachmentComputedResult) =>
  hasTriggerKey(result, 'space-protection') || hasTriggerKey(result, 'emotional-shutdown')

const average = (...values: number[]) =>
  Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)

const buildTriggerSummary = (
  left: AttachmentComputedResult,
  right: AttachmentComputedResult,
) => {
  const leftTopTrigger = left.strongestTriggers[0]
  const rightTopTrigger = right.strongestTriggers[0]

  if (!leftTopTrigger || !rightTopTrigger) {
    return 'The clearest couples signal will come from how each person reacts when closeness, conflict, or space suddenly feel loaded.'
  }

  if (
    (hasTriggerKey(left, 'distance-alarm') && hasProtectiveSpacePattern(right))
    || (hasTriggerKey(right, 'distance-alarm') && hasProtectiveSpacePattern(left))
  ) {
    return 'The biggest escalation risk is a reassurance-versus-space collision: one person reaches harder when unsure, while the other protects by pulling back or shutting down.'
  }

  if (hasTriggerKey(left, 'distance-alarm') && hasTriggerKey(right, 'distance-alarm')) {
    return 'Both partners react quickly to distance or ambiguity, so slow replies, vague conflict endings, or uncertain tone can escalate faster than either person expects.'
  }

  if (hasProtectiveSpacePattern(left) && hasProtectiveSpacePattern(right)) {
    return 'Both partners protect themselves with distance or shutdown, which can keep the peace on the surface while important feelings stay unspoken underneath.'
  }

  if (hasTriggerKey(left, 'push-pull') && hasTriggerKey(right, 'push-pull')) {
    return 'Both partners carry a strong push-pull signal, so intensity may rise fast and then flip into fear, retreat, or second-guessing just as quickly.'
  }

  if (leftTopTrigger.key === rightTopTrigger.key) {
    return `Both partners are especially sensitive to ${triggerLabels[leftTopTrigger.key]}, so that theme needs the clearest structure and repair habits.`
  }

  return `${attachmentResults[left.type].label} is most activated by ${triggerLabels[leftTopTrigger.key]}, while ${attachmentResults[right.type].label} reacts fastest to ${triggerLabels[rightTopTrigger.key]}.`
}

const buildStrengthSummary = (
  template: CouplesPairTemplate,
  left: AttachmentComputedResult,
  right: AttachmentComputedResult,
) => {
  const averageSecurity = average(
    getDimensionPercentage(left, 'security'),
    getDimensionPercentage(right, 'security'),
  )

  if (averageSecurity >= 68) {
    return 'There is real repair capacity here. Even when tension hits, both people still have enough secure ground to come back to direct conversation and reconnection.'
  }

  if (left.type === 'secure' || right.type === 'secure') {
    return 'At least one partner can usually access steadier repair when stress rises, which gives this pairing a practical anchor if it gets used for clarity instead of over-functioning.'
  }

  if (left.type === 'anxious' && right.type === 'anxious') {
    return 'Both people care deeply about staying connected, so the motivation to repair is strong once the initial activation settles.'
  }

  if (left.type === 'avoidant' && right.type === 'avoidant') {
    return 'Both people usually respect autonomy, which means space can feel less threatening here as long as it is named instead of assumed.'
  }

  if (left.type === 'fearful-avoidant' && right.type === 'fearful-avoidant') {
    return 'Both partners want depth and emotional truth, which can create unusually strong empathy when the pace is steady enough for trust to hold.'
  }

  return template.strengthSummary
}

const buildRepairSummary = (
  template: CouplesPairTemplate,
  left: AttachmentComputedResult,
  right: AttachmentComputedResult,
) => {
  const averageSecurity = average(
    getDimensionPercentage(left, 'security'),
    getDimensionPercentage(right, 'security'),
  )

  if (
    (hasTriggerKey(left, 'distance-alarm') && hasProtectiveSpacePattern(right))
    || (hasTriggerKey(right, 'distance-alarm') && hasProtectiveSpacePattern(left))
  ) {
    return 'When one person needs space and the other needs reassurance, make the pause explicit: say what is happening, how long it will last, and exactly when reconnection will happen.'
  }

  if (hasTriggerKey(left, 'distance-alarm') && hasTriggerKey(right, 'distance-alarm')) {
    return 'Use faster repair signals after conflict or silence so neither person has to sit in uncertainty and start filling in the blanks.'
  }

  if (hasProtectiveSpacePattern(left) && hasProtectiveSpacePattern(right)) {
    return 'Put words on the need for space before either person disappears into silence, and agree on a minimum check-in rhythm after harder conversations.'
  }

  if (hasTriggerKey(left, 'push-pull') && hasTriggerKey(right, 'push-pull')) {
    return 'Slow the pace after emotionally intense moments and come back to one concrete issue at a time instead of trying to solve the whole relationship while activated.'
  }

  if (averageSecurity <= 38) {
    return 'Keep repair short and concrete: what happened, what each person needs now, and when you will reconnect.'
  }

  return template.repairSummary
}

const buildRepairMoves = (
  left: AttachmentComputedResult,
  right: AttachmentComputedResult,
  repairSummary: string,
) => {
  const moves = new Set<string>()

  moves.add(repairSummary)

  if (left.nextSteps[0]) {
    moves.add(left.nextSteps[0])
  }

  if (right.nextSteps[0]) {
    moves.add(right.nextSteps[0])
  }

  if (
    (hasTriggerKey(left, 'distance-alarm') && hasProtectiveSpacePattern(right))
    || (hasTriggerKey(right, 'distance-alarm') && hasProtectiveSpacePattern(left))
  ) {
    moves.add('Trade vague space for named space: one reassurance cue, one boundary, one reconnect time.')
  }

  if (hasTriggerKey(left, 'push-pull') || hasTriggerKey(right, 'push-pull')) {
    moves.add('Do not make all-or-nothing relationship decisions in the middle of an activation spike.')
  }

  return Array.from(moves).slice(0, 3)
}

const buildSharedThemes = (
  left: AttachmentComputedResult,
  right: AttachmentComputedResult,
) => {
  const sharedTriggerKeys = left.strongestTriggers
    .map((trigger) => trigger.key)
    .filter((key) => right.strongestTriggers.some((trigger) => trigger.key === key))

  const themes = new Set<string>()

  for (const key of sharedTriggerKeys) {
    themes.add(triggerLabels[key])
  }

  if (average(getDimensionPercentage(left, 'security'), getDimensionPercentage(right, 'security')) >= 65) {
    themes.add('repair capacity')
  }

  if (average(getDimensionPercentage(left, 'push-pull'), getDimensionPercentage(right, 'push-pull')) >= 60) {
    themes.add('emotional intensity')
  }

  if (
    average(getDimensionPercentage(left, 'avoidance'), getDimensionPercentage(right, 'avoidance')) >= 60
  ) {
    themes.add('space sensitivity')
  }

  if (
    average(getDimensionPercentage(left, 'anxiety'), getDimensionPercentage(right, 'anxiety')) >= 60
  ) {
    themes.add('reassurance sensitivity')
  }

  return Array.from(themes).slice(0, 4)
}

const toProfileSummary = (result: AttachmentComputedResult): AttachmentCouplesProfileSummary => ({
  type: result.type,
  label: result.content.label,
  eyebrow: result.content.eyebrow,
  badgeClass: result.content.badgeClass,
  surfaceClass: result.content.surfaceClass,
  borderClass: result.content.borderClass,
  subprofileLabel: result.subprofileLabel,
  subprofileSummary: result.subprofileSummary,
  relationshipNeeds: result.content.relationshipNeeds.slice(0, 2),
  strongestTriggers: result.strongestTriggers.map((trigger: AttachmentTriggerProfile) => trigger.label).slice(0, 2),
  firstNextStep: result.nextSteps[0] ?? 'Stay direct about what helps you feel safer before the pattern takes over.',
})

export const buildAttachmentCouplesReport = (
  left: AttachmentComputedResult,
  right: AttachmentComputedResult,
): AttachmentCouplesReport => {
  const template = pairTemplates[getPairKey(left.type, right.type)]

  if (!template) {
    throw new Error('Missing couples template for attachment style pair.')
  }

  const triggerSummary = buildTriggerSummary(left, right)
  const strengthSummary = buildStrengthSummary(template, left, right)
  const repairSummary = buildRepairSummary(template, left, right)

  return {
    dynamicLabel: template.dynamicLabel,
    overview: template.overview,
    frictionSummary: template.frictionSummary,
    strengthSummary,
    repairSummary,
    triggerSummary,
    repairMoves: buildRepairMoves(left, right, repairSummary),
    sharedThemes: buildSharedThemes(left, right),
    profiles: [toProfileSummary(left), toProfileSummary(right)],
  }
}
