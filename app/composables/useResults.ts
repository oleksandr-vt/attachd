import {
  attachmentStyleTypes,
  attachmentTest,
  type AttachmentQuestion,
  type AttachmentStyleType,
} from '~/data/tests/attachment'
import { attachmentResults } from '~/data/tests/results'

export type AttachmentAnswerMap = Record<string, number | null>
export type AttachmentScoreMap = Record<AttachmentStyleType, number>

export type AttachmentRankingItem = {
  type: AttachmentStyleType
  label: string
  score: number
  percentage: number
  accentClass: string
  barClass: string
}

export type AttachmentComputedResult = {
  type: AttachmentStyleType
  content: (typeof attachmentResults)[AttachmentStyleType]
  totals: AttachmentScoreMap
  percentages: AttachmentScoreMap
  ranking: AttachmentRankingItem[]
  dominantPercentage: number
  secondaryType: AttachmentStyleType
}

const emptyScoreMap = (): AttachmentScoreMap => ({
  secure: 0,
  anxious: 0,
  avoidant: 0,
  'fearful-avoidant': 0,
})

const getQuestionWeight = (question: AttachmentQuestion, style: AttachmentStyleType) =>
  question.weights[style] ?? 0

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

export const useResults = () => {
  const getResultContent = (type: AttachmentStyleType) => attachmentResults[type]

  const getResultFromAnswers = (answers: AttachmentAnswerMap): AttachmentComputedResult => {
    const totals = calculateTotals(answers)
    const percentages = calculatePercentages(totals)
    const ranking = buildRanking(totals, percentages)
    const primaryType = ranking[0]?.type ?? 'secure'
    const secondaryType = ranking[1]?.type ?? primaryType

    return {
      type: primaryType,
      content: attachmentResults[primaryType],
      totals,
      percentages,
      ranking,
      dominantPercentage: percentages[primaryType],
      secondaryType,
    }
  }

  return {
    attachmentResults,
    attachmentStyleTypes,
    attachmentTest,
    getResultContent,
    getResultFromAnswers,
  }
}
