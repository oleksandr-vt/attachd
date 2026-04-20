import type { AttachmentStyleType } from '../../app/data/tests/attachment'
import type { AttachmentAnswerMap, AttachmentComputedResult } from './scoring'

export const ATTACHMENT_QUESTION_SET_VERSION = '2026-04-21-v1'
export const ATTACHMENT_SCORING_VERSION = '2026-04-21-v1'

export type AttachmentPersistedResultRecord = {
  token: string
  slug: 'attachment'
  createdAt: string
  questionSetVersion: string
  scoringVersion: string
  answers: AttachmentAnswerMap
  result: AttachmentComputedResult
  primaryType: AttachmentStyleType
  secondaryType: AttachmentStyleType
  email: string
  emailUnlocked: boolean
}

export type AttachmentPersistedResultResponse = {
  record: AttachmentPersistedResultRecord
  shareUrl: string
}
