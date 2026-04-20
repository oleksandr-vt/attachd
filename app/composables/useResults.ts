import { attachmentStyleTypes, attachmentTest, type AttachmentStyleType } from '~/data/tests/attachment'
import { attachmentResults } from '~/data/tests/results'
import { computeAttachmentResult } from '~~/shared/attachment/scoring'

export type {
  AttachmentAnswerMap,
  AttachmentComputedResult,
  AttachmentDimensionKey,
  AttachmentDimensionProfile,
  AttachmentRankingItem,
  AttachmentScoreLevel,
  AttachmentScoreMap,
  AttachmentTriggerKey,
  AttachmentTriggerProfile,
} from '~~/shared/attachment/scoring'

export const useResults = () => {
  const getResultContent = (type: AttachmentStyleType) => attachmentResults[type]

  return {
    attachmentResults,
    attachmentStyleTypes,
    attachmentTest,
    getResultContent,
    getResultFromAnswers: computeAttachmentResult,
  }
}
