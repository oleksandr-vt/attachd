import { randomBytes } from 'node:crypto'
import { attachmentTest } from '~~/app/data/tests/attachment'
import { normalizeOptionalEmail } from '~~/shared/email'
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
  insertAttachmentResultRecord,
  markAttachmentResultVerificationEmailSent,
} from '~~/server/utils/attachment-result-store'
import { sendAttachmentResultVerificationEmail } from '~~/server/utils/attachment-email'
import {
  createEmailVerificationExpiresAt,
  createEmailVerificationToken,
  hashEmailVerificationToken,
} from '~~/server/utils/email-verification'
import {
  assertTurnstileToken,
  enforceRateLimit,
  getClientIp,
  getSiteOrigin,
  readGuardedJsonBody,
} from '~~/server/utils/h3-guards'
import { consumeRateLimit } from '~~/server/utils/rate-limit'

const MAX_TOKEN_ATTEMPTS = 3

const createShareToken = () => randomBytes(8).toString('hex')

const canSendVerificationEmail = async (email: string, clientIp: string | null) => {
  const recipientBudget = await consumeRateLimit('emailsPerRecipient', email)
  const ipBudget = clientIp ? await consumeRateLimit('emailsPerIp', clientIp) : null

  return recipientBudget.allowed && (ipBudget?.allowed ?? true)
}

export default defineEventHandler(async (event): Promise<AttachmentPersistedResultResponse> => {
  const body = await readGuardedJsonBody(event)
  const answers = normalizeAttachmentAnswers(body.answers)
  const emailInput = normalizeOptionalEmail(body.email)

  if (!isAttachmentAnswerComplete(answers)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Complete all ${attachmentTest.questions.length} questions before creating a result.`,
    })
  }

  if (!emailInput.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a valid email address, or leave the field empty.',
    })
  }

  await assertTurnstileToken(event, body.turnstileToken, 'save-result')

  const clientIp = getClientIp(event)

  await enforceRateLimit(
    event,
    'resultsPerIp',
    'You have saved several results in a short time. Please try again a little later.',
    clientIp,
  )
  await enforceRateLimit(
    event,
    'resultsGlobal',
    'Attachd has reached its daily limit for new saved results. Please try again tomorrow.',
  )

  const { email } = emailInput
  const siteOrigin = getSiteOrigin(event)
  const result = computeAttachmentResult(answers)
  const emailVerificationToken = email ? createEmailVerificationToken() : ''
  let record: AttachmentPersistedResultRecord | null = null

  for (let attempt = 0; attempt < MAX_TOKEN_ATTEMPTS && !record; attempt += 1) {
    const candidate: AttachmentPersistedResultRecord = {
      token: createShareToken(),
      slug: 'attachment',
      createdAt: new Date().toISOString(),
      questionSetVersion: ATTACHMENT_QUESTION_SET_VERSION,
      scoringVersion: ATTACHMENT_SCORING_VERSION,
      answers,
      result,
      primaryType: result.type,
      secondaryType: result.secondaryType,
      email,
      emailVerificationTokenHash: email ? hashEmailVerificationToken(emailVerificationToken) : '',
      emailVerificationSentAt: null,
      emailVerificationExpiresAt: email ? createEmailVerificationExpiresAt() : null,
      emailVerifiedAt: null,
      welcomeEmailSentAt: null,
    }

    if (await insertAttachmentResultRecord(candidate)) {
      record = candidate
    }
  }

  if (!record) {
    throw createError({
      statusCode: 500,
      statusMessage: 'We could not save your result just now. Please try again.',
    })
  }

  const shareUrl = `${siteOrigin}/r/${record.token}`
  let emailVerificationSent = false

  if (email) {
    const verificationUrl = `${siteOrigin}/api/email/verify?token=${emailVerificationToken}`

    if (import.meta.dev) {
      console.info(`[dev] Email verification link for result ${record.token}: ${verificationUrl}`)
    }

    if (await canSendVerificationEmail(email, clientIp)) {
      emailVerificationSent = await sendAttachmentResultVerificationEmail(record, verificationUrl, shareUrl)
    }

    if (emailVerificationSent) {
      await markAttachmentResultVerificationEmailSent(record.token)
    }
  }

  return {
    record: toAttachmentPersistedResultPublicRecord(record),
    shareUrl,
    emailVerificationSent,
  }
})
