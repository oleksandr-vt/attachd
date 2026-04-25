import { randomBytes } from 'node:crypto'
import { attachmentTest } from '~~/app/data/tests/attachment'
import {
  ATTACHMENT_QUESTION_SET_VERSION,
  ATTACHMENT_SCORING_VERSION,
  toAttachmentPersistedResultPublicRecord,
  type AttachmentPersistedResultRecord,
  type AttachmentPersistedResultResponse,
} from '~~/shared/attachment/persistence'
import {
  computeAttachmentResult,
  isAttachmentAnswerComplete,
  normalizeAttachmentAnswers,
} from '~~/shared/attachment/scoring'
import {
  getAttachmentResultRecord,
  saveAttachmentResultRecord,
  updateAttachmentResultRecord,
} from '~~/server/utils/attachment-result-store'
import { sendAttachmentResultVerificationEmail } from '~~/server/utils/attachment-email'
import {
  createEmailVerificationExpiresAt,
  createEmailVerificationToken,
  hashEmailVerificationToken,
} from '~~/server/utils/email-verification'

type CreateAttachmentResultBody = {
  answers?: unknown
  email?: string
}

const createShareToken = () => randomBytes(8).toString('hex')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const createUniqueShareToken = async () => {
  let token = createShareToken()

  while (await getAttachmentResultRecord(token)) {
    token = createShareToken()
  }

  return token
}

export default defineEventHandler(async (event): Promise<AttachmentPersistedResultResponse> => {
  const body = await readBody<CreateAttachmentResultBody>(event)
  const answers = normalizeAttachmentAnswers(body.answers)
  const email = body.email?.trim() ?? ''

  if (!isAttachmentAnswerComplete(answers)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Complete all ${attachmentTest.questions.length} questions before creating a result.`,
    })
  }

  if (!emailPattern.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a valid email address before viewing your result.',
    })
  }

  const result = computeAttachmentResult(answers)
  const token = await createUniqueShareToken()
  const createdAt = new Date().toISOString()
  const requestUrl = getRequestURL(event)
  const shareUrl = `${requestUrl.origin}/r/${token}`
  const emailVerificationToken = createEmailVerificationToken()
  const emailVerificationTokenHash = hashEmailVerificationToken(emailVerificationToken)
  const emailVerificationExpiresAt = createEmailVerificationExpiresAt()

  const record: AttachmentPersistedResultRecord = {
    token,
    slug: 'attachment',
    createdAt,
    questionSetVersion: ATTACHMENT_QUESTION_SET_VERSION,
    scoringVersion: ATTACHMENT_SCORING_VERSION,
    answers,
    result,
    primaryType: result.type,
    secondaryType: result.secondaryType,
    email,
    emailUnlocked: true,
    emailVerificationTokenHash,
    emailVerificationSentAt: null,
    emailVerificationExpiresAt,
    emailVerifiedAt: null,
    welcomeEmailSentAt: null,
  }

  await saveAttachmentResultRecord(record)

  const verificationUrl = `${requestUrl.origin}/api/email/verify?token=${emailVerificationToken}`
  const emailSent = await sendAttachmentResultVerificationEmail(record, verificationUrl, shareUrl)
  const responseRecord = emailSent
    ? await updateAttachmentResultRecord(token, (currentRecord) => ({
        ...currentRecord,
        emailVerificationSentAt: new Date().toISOString(),
      }))
    : record

  return {
    record: toAttachmentPersistedResultPublicRecord(responseRecord ?? record),
    shareUrl,
    emailVerificationSent: Boolean(responseRecord?.emailVerificationSentAt),
  }
})
