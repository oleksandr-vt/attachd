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
  emailVerificationTokenHash: string
  emailVerificationSentAt: string | null
  emailVerificationExpiresAt: string | null
  emailVerifiedAt: string | null
  welcomeEmailSentAt: string | null
}

export type AttachmentPersistedResultPublicRecord = Omit<
  AttachmentPersistedResultRecord,
  'email'
  | 'emailUnlocked'
  | 'emailVerificationTokenHash'
  | 'emailVerificationExpiresAt'
  | 'emailVerificationSentAt'
  | 'emailVerifiedAt'
  | 'welcomeEmailSentAt'
>

export type AttachmentPersistedResultResponse = {
  record: AttachmentPersistedResultPublicRecord
  shareUrl: string
  emailVerificationSent: boolean
}

export const toAttachmentPersistedResultPublicRecord = (
  record: AttachmentPersistedResultRecord,
): AttachmentPersistedResultPublicRecord => ({
  token: record.token,
  slug: record.slug,
  createdAt: record.createdAt,
  questionSetVersion: record.questionSetVersion,
  scoringVersion: record.scoringVersion,
  answers: record.answers,
  result: record.result,
  primaryType: record.primaryType,
  secondaryType: record.secondaryType,
})
