import {
  attachmentStyleTypes,
  attachmentTest,
  type AttachmentQuestion,
  type AttachmentStyleType,
} from '../../app/data/tests/attachment'
import { attachmentResults } from '../../app/data/tests/results'

export type AttachmentAnswerMap = Record<string, number | null>
export type AttachmentScoreMap = Record<AttachmentStyleType, number>
export type AttachmentScoreLevel = 'low' | 'medium' | 'high'

export type AttachmentDimensionKey = 'security' | 'anxiety' | 'avoidance' | 'push-pull'
export type AttachmentTriggerKey =
  | 'distance-alarm'
  | 'conflict-spiral'
  | 'space-protection'
  | 'emotional-shutdown'
  | 'push-pull'

export type AttachmentRankingItem = {
  type: AttachmentStyleType
  label: string
  score: number
  percentage: number
  accentClass: string
  barClass: string
}

export type AttachmentDimensionProfile = {
  key: AttachmentDimensionKey
  label: string
  percentage: number
  level: AttachmentScoreLevel
  summary: string
}

export type AttachmentTriggerProfile = {
  key: AttachmentTriggerKey
  label: string
  percentage: number
  summary: string
}

export type AttachmentComputedResult = {
  type: AttachmentStyleType
  content: (typeof attachmentResults)[AttachmentStyleType]
  totals: AttachmentScoreMap
  percentages: AttachmentScoreMap
  ranking: AttachmentRankingItem[]
  dominantPercentage: number
  secondaryType: AttachmentStyleType
  dimensions: AttachmentDimensionProfile[]
  triggerClusters: AttachmentTriggerProfile[]
  strongestTriggers: AttachmentTriggerProfile[]
  subprofileLabel: string
  subprofileSummary: string
  stylePairSummary: string
  scoreNote: string
  nextSteps: string[]
}

const emptyScoreMap = (): AttachmentScoreMap => ({
  secure: 0,
  anxious: 0,
  avoidant: 0,
  'fearful-avoidant': 0,
})

export const createEmptyAttachmentAnswers = (): AttachmentAnswerMap =>
  Object.fromEntries(
    attachmentTest.questions.map((question) => [question.id, null]),
  ) as AttachmentAnswerMap

export const normalizeAttachmentAnswers = (value: unknown): AttachmentAnswerMap => {
  const baseAnswers = createEmptyAttachmentAnswers()

  if (!value || typeof value !== 'object') {
    return baseAnswers
  }

  for (const question of attachmentTest.questions) {
    const rawAnswer = (value as Record<string, unknown>)[question.id]
    baseAnswers[question.id] = typeof rawAnswer === 'number' && Number.isInteger(rawAnswer) && rawAnswer >= 0 && rawAnswer <= 4
      ? rawAnswer
      : null
  }

  return baseAnswers
}

export const isAttachmentAnswerComplete = (answers: AttachmentAnswerMap) =>
  attachmentTest.questions.every((question) => typeof answers[question.id] === 'number')

const getQuestionWeight = (question: AttachmentQuestion, style: AttachmentStyleType) =>
  question.weights[style] ?? 0

const scoreNote =
  'These bars show your internal score profile inside this quiz. They are not population percentiles, validated cutoffs, or a clinical diagnosis.'

const dimensionDefinitions = [
  {
    key: 'security',
    label: 'Security',
    questionIds: ['q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22'],
  },
  {
    key: 'anxiety',
    label: 'Attachment anxiety',
    questionIds: ['q01', 'q02', 'q03', 'q04', 'q05', 'q23'],
  },
  {
    key: 'avoidance',
    label: 'Attachment avoidance',
    questionIds: ['q06', 'q07', 'q08', 'q09', 'q10', 'q24'],
  },
  {
    key: 'push-pull',
    label: 'Push-pull pattern',
    questionIds: ['q11', 'q12', 'q13', 'q14', 'q15', 'q25'],
  },
] as const

const triggerDefinitions = [
  {
    key: 'distance-alarm',
    label: 'Distance alarm',
    questionIds: ['q01', 'q02', 'q04', 'q23'],
    summary: 'Distance, mixed signals, or slow replies tend to register as threat quickly.',
  },
  {
    key: 'conflict-spiral',
    label: 'Conflict spiral',
    questionIds: ['q03', 'q05'],
    summary: 'After friction, your mind keeps checking whether the bond is still safe.',
  },
  {
    key: 'space-protection',
    label: 'Space protection',
    questionIds: ['q06', 'q07', 'q24'],
    summary: 'When closeness feels loaded, you protect yourself by reclaiming distance or autonomy.',
  },
  {
    key: 'emotional-shutdown',
    label: 'Emotional shutdown',
    questionIds: ['q08', 'q09', 'q10'],
    summary: 'Intensity can push you toward control, muted feelings, or temporary withdrawal.',
  },
  {
    key: 'push-pull',
    label: 'Push-pull intensity',
    questionIds: ['q11', 'q12', 'q13', 'q14', 'q15', 'q25'],
    summary: 'Part of you wants closeness while another part braces for hurt, disappointment, or overwhelm.',
  },
] as const

const getScoreLevel = (percentage: number): AttachmentScoreLevel => {
  if (percentage >= 70) {
    return 'high'
  }

  if (percentage >= 40) {
    return 'medium'
  }

  return 'low'
}

const formatScoreLevel = (level: AttachmentScoreLevel) =>
  `${level.charAt(0).toUpperCase()}${level.slice(1)}`

const calculateQuestionSetPercentage = (answers: AttachmentAnswerMap, questionIds: readonly string[]) => {
  const maxScore = questionIds.length * 4

  if (!maxScore) {
    return 0
  }

  const total = questionIds.reduce((sum, questionId) => {
    const answerValue = answers[questionId]
    return sum + (typeof answerValue === 'number' ? answerValue : 0)
  }, 0)

  return Math.round((total / maxScore) * 100)
}

const buildDimensionSummary = (
  key: AttachmentDimensionKey,
  percentage: number,
  level: AttachmentScoreLevel,
): string => {
  const bandLabel = `${formatScoreLevel(level)} (${percentage}%)`

  switch (key) {
    case 'security':
      if (level === 'high') {
        return `${bandLabel}. You still have access to repair, trust, and clearer communication under stress.`
      }

      if (level === 'medium') {
        return `${bandLabel}. You can access steadier responses, but they are not always your first move when pressure rises.`
      }

      return `${bandLabel}. Repair and direct reassurance may be harder to access when closeness feels risky.`

    case 'anxiety':
      if (level === 'high') {
        return `${bandLabel}. Uncertainty tends to activate quickly, especially around distance, silence, or inconsistency.`
      }

      if (level === 'medium') {
        return `${bandLabel}. You notice shifts in closeness, but the alarm does not fully take over every time.`
      }

      return `${bandLabel}. You are less likely to treat distance or ambiguity as immediate danger.`

    case 'avoidance':
      if (level === 'high') {
        return `${bandLabel}. Space, self-reliance, or emotional control become strong protective moves under pressure.`
      }

      if (level === 'medium') {
        return `${bandLabel}. Part of you values closeness, but another part still protects autonomy when intensity rises.`
      }

      return `${bandLabel}. You are less likely to rely on distance or shutdown as the main safety strategy.`

    case 'push-pull':
      if (level === 'high') {
        return `${bandLabel}. Wanting closeness and bracing against it are both active in your system.`
      }

      if (level === 'medium') {
        return `${bandLabel}. You may feel some approach-avoid tension, but it is not driving the whole pattern.`
      }

      return `${bandLabel}. Closeness and vulnerability feel less internally conflicted for you in this quiz.`
  }
}

const buildDimensions = (answers: AttachmentAnswerMap): AttachmentDimensionProfile[] =>
  dimensionDefinitions.map(({ key, label, questionIds }) => {
    const percentage = calculateQuestionSetPercentage(answers, questionIds)
    const level = getScoreLevel(percentage)

    return {
      key,
      label,
      percentage,
      level,
      summary: buildDimensionSummary(key, percentage, level),
    }
  })

const buildTriggerClusters = (answers: AttachmentAnswerMap): AttachmentTriggerProfile[] =>
  triggerDefinitions
    .map(({ key, label, questionIds, summary }) => ({
      key,
      label,
      percentage: calculateQuestionSetPercentage(answers, questionIds),
      summary,
    }))
    .sort((left, right) => right.percentage - left.percentage)

const getDimensionByKey = (
  dimensions: AttachmentDimensionProfile[],
  key: AttachmentDimensionKey,
) => dimensions.find((dimension) => dimension.key === key)

const buildSubprofileLabel = (
  primaryType: AttachmentStyleType,
  dimensions: AttachmentDimensionProfile[],
): string => {
  const security = getDimensionByKey(dimensions, 'security')
  const anxiety = getDimensionByKey(dimensions, 'anxiety')
  const avoidance = getDimensionByKey(dimensions, 'avoidance')
  const pushPull = getDimensionByKey(dimensions, 'push-pull')

  if (!security || !anxiety || !avoidance || !pushPull) {
    return `${attachmentResults[primaryType].label} leaning`
  }

  if (security.level === 'high' && anxiety.level === 'low' && avoidance.level === 'low') {
    return 'Grounded and balanced'
  }

  if (pushPull.level === 'high' || (anxiety.level === 'high' && avoidance.level === 'high')) {
    return 'Push-pull under stress'
  }

  if (anxiety.level === 'high' && avoidance.level !== 'high') {
    return 'Closeness-seeking under uncertainty'
  }

  if (avoidance.level === 'high' && anxiety.level !== 'high') {
    return 'Self-protective under pressure'
  }

  if (security.level === 'high') {
    return 'Mostly steady with stress spikes'
  }

  return `${attachmentResults[primaryType].label} leaning`
}

const buildSubprofileSummary = (
  primaryType: AttachmentStyleType,
  secondaryType: AttachmentStyleType,
  dimensions: AttachmentDimensionProfile[],
): string => {
  const primaryLabel = attachmentResults[primaryType].label
  const secondaryLabel = attachmentResults[secondaryType].label
  const anxiety = getDimensionByKey(dimensions, 'anxiety')
  const avoidance = getDimensionByKey(dimensions, 'avoidance')
  const security = getDimensionByKey(dimensions, 'security')
  const pushPull = getDimensionByKey(dimensions, 'push-pull')

  if (!anxiety || !avoidance || !security || !pushPull) {
    return `Your answers lean ${primaryLabel.toLowerCase()}, with ${secondaryLabel.toLowerCase()} showing up as the backup pattern when stress rises.`
  }

  const overview =
    `Your answers lean ${primaryLabel.toLowerCase()}, with ${secondaryLabel.toLowerCase()} showing up second. ` +
    `In this quiz that looks like ${anxiety.level} anxiety, ${avoidance.level} avoidance, and ${security.level} secure capacity.`

  if (pushPull.level === 'high') {
    return `${overview} The clearest extra signal is a strong push-pull response around closeness and vulnerability.`
  }

  if (anxiety.level === 'high' && avoidance.level === 'high') {
    return `${overview} Both pursuit and self-protection are active, so closeness can feel needed and risky at the same time.`
  }

  if (anxiety.level === 'high') {
    return `${overview} Your system reacts fastest to distance, inconsistency, and the need for explicit reassurance.`
  }

  if (avoidance.level === 'high') {
    return `${overview} Your system relies more on space, control, or emotional downshifting when intensity climbs.`
  }

  if (security.level === 'high') {
    return `${overview} Even when stress shows up, you still have a meaningful base of repair and steadiness to work from.`
  }

  return overview
}

const buildStylePairSummary = (
  primaryType: AttachmentStyleType,
  secondaryType: AttachmentStyleType,
): string => {
  const primaryLabel = attachmentResults[primaryType].label
  const secondaryLabel = attachmentResults[secondaryType].label

  if (primaryType === secondaryType) {
    return `Your strongest pattern in this run was ${primaryLabel}.`
  }

  return `Top two styles in this run: ${primaryLabel} first, ${secondaryLabel} second. That usually means stress can borrow from the second pattern even when the first one leads.`
}

const buildNextSteps = (
  primaryType: AttachmentStyleType,
  dimensions: AttachmentDimensionProfile[],
  strongestTriggers: AttachmentTriggerProfile[],
): string[] => {
  const anxiety = getDimensionByKey(dimensions, 'anxiety')
  const avoidance = getDimensionByKey(dimensions, 'avoidance')
  const security = getDimensionByKey(dimensions, 'security')
  const pushPull = getDimensionByKey(dimensions, 'push-pull')
  const topTriggerKeys = strongestTriggers.map((trigger) => trigger.key)
  const steps: string[] = []

  if (anxiety?.level === 'high' || topTriggerKeys.includes('distance-alarm')) {
    steps.push('Replace testing and spiraling with one direct reassurance ask when distance feels loaded.')
  }

  if (topTriggerKeys.includes('conflict-spiral')) {
    steps.push('After conflict, agree on a repair window instead of leaving the relationship status undefined.')
  }

  if (avoidance?.level === 'high' || topTriggerKeys.includes('space-protection')) {
    steps.push('When you need space, name it clearly and include when you plan to reconnect.')
  }

  if (topTriggerKeys.includes('emotional-shutdown')) {
    steps.push('Share one honest feeling earlier, before control or shutdown fully takes over the interaction.')
  }

  if (pushPull?.level === 'high' || topTriggerKeys.includes('push-pull')) {
    steps.push('Slow the pace after big moments of closeness so fear does not turn into sudden withdrawal.')
  }

  if (security?.level === 'high') {
    steps.push('Use your steadier moments to set boundaries early instead of carrying more than the relationship can hold.')
  } else {
    steps.push('Practice one short repair script you can use when stress spikes: what happened, what you need, and when you will reconnect.')
  }

  if (steps.length < 3) {
    steps.push(`Keep your ${attachmentResults[primaryType].label.toLowerCase()} pattern in mind, but treat it as a tendency to work with rather than a fixed identity.`)
  }

  return steps.slice(0, 3)
}

const maximumScores = attachmentTest.questions.reduce<AttachmentScoreMap>((scores, question) => {
  for (const style of attachmentStyleTypes) {
    scores[style] += getQuestionWeight(question, style) * 4
  }

  return scores
}, emptyScoreMap())

const buildRanking = (
  totals: AttachmentScoreMap,
  percentages: AttachmentScoreMap,
): AttachmentRankingItem[] => {
  return attachmentStyleTypes
    .map((type) => ({
      type,
      label: attachmentResults[type].label,
      score: Number(totals[type].toFixed(2)),
      percentage: percentages[type],
      accentClass: attachmentResults[type].accentClass,
      barClass: attachmentResults[type].barClass,
    }))
    .sort((left, right) => {
      if (right.percentage !== left.percentage) {
        return right.percentage - left.percentage
      }

      if (right.score !== left.score) {
        return right.score - left.score
      }

      return attachmentStyleTypes.indexOf(left.type) - attachmentStyleTypes.indexOf(right.type)
    })
}

const calculateTotals = (answers: AttachmentAnswerMap): AttachmentScoreMap => {
  const totals = emptyScoreMap()

  for (const question of attachmentTest.questions) {
    const answerValue = answers[question.id]

    if (typeof answerValue !== 'number') {
      continue
    }

    for (const style of attachmentStyleTypes) {
      totals[style] += answerValue * getQuestionWeight(question, style)
    }
  }

  return totals
}

const calculatePercentages = (totals: AttachmentScoreMap): AttachmentScoreMap => {
  const percentages = emptyScoreMap()

  for (const style of attachmentStyleTypes) {
    const maxScore = maximumScores[style]
    percentages[style] = maxScore > 0
      ? Math.round((totals[style] / maxScore) * 100)
      : 0
  }

  return percentages
}

export const computeAttachmentResult = (answers: AttachmentAnswerMap): AttachmentComputedResult => {
  const totals = calculateTotals(answers)
  const percentages = calculatePercentages(totals)
  const ranking = buildRanking(totals, percentages)
  const primaryType = ranking[0]?.type ?? 'secure'
  const secondaryType = ranking[1]?.type ?? primaryType
  const dimensions = buildDimensions(answers)
  const triggerClusters = buildTriggerClusters(answers)
  const strongestTriggers = triggerClusters.slice(0, 3)

  return {
    type: primaryType,
    content: attachmentResults[primaryType],
    totals,
    percentages,
    ranking,
    dominantPercentage: percentages[primaryType],
    secondaryType,
    dimensions,
    triggerClusters,
    strongestTriggers,
    subprofileLabel: buildSubprofileLabel(primaryType, dimensions),
    subprofileSummary: buildSubprofileSummary(primaryType, secondaryType, dimensions),
    stylePairSummary: buildStylePairSummary(primaryType, secondaryType),
    scoreNote,
    nextSteps: buildNextSteps(primaryType, dimensions, strongestTriggers),
  }
}
