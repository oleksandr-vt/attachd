import {
  toAttachmentPersistedResultPublicRecord,
  type AttachmentPersistedResultResponse,
} from '~~/shared/attachment/persistence'
import { updateAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import { sendAttachmentResultVerificationEmail } from '~~/server/utils/attachment-email'
import {
  createEmailVerificationExpiresAt,
  createEmailVerificationToken,
  hashEmailVerificationToken,
} from '~~/server/utils/email-verification'

type UnlockAttachmentEmailBody = {
  email?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event): Promise<AttachmentPersistedResultResponse> => {
  const token = getRouterParam(event, 'token')

  if (!token || !/^[a-f0-9]{16}$/i.test(token)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  const body = await readBody<UnlockAttachmentEmailBody>(event)
  const email = body.email?.trim() ?? ''

  if (!emailPattern.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a valid email address to update this result.',
    })
  }

  const emailVerificationToken = createEmailVerificationToken()
  const emailVerificationTokenHash = hashEmailVerificationToken(emailVerificationToken)
  const emailVerificationExpiresAt = createEmailVerificationExpiresAt()
  const record = await updateAttachmentResultRecord(token, (currentRecord) => ({
    ...currentRecord,
    email,
    emailUnlocked: true,
    emailVerificationTokenHash,
    emailVerificationSentAt: null,
    emailVerificationExpiresAt,
    emailVerifiedAt: currentRecord.email.toLowerCase() === email.toLowerCase()
      ? currentRecord.emailVerifiedAt
      : null,
  }))

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  const requestUrl = getRequestURL(event)
  const shareUrl = `${requestUrl.origin}/r/${token}`

  if (!record.emailVerifiedAt) {
    const verificationUrl = `${requestUrl.origin}/api/email/verify?token=${emailVerificationToken}`
    const emailSent = await sendAttachmentResultVerificationEmail(record, verificationUrl, shareUrl)

    if (emailSent) {
      const responseRecord = await updateAttachmentResultRecord(token, (currentRecord) => ({
        ...currentRecord,
        emailVerificationSentAt: new Date().toISOString(),
      }))

      if (responseRecord) {
        return {
          record: toAttachmentPersistedResultPublicRecord(responseRecord),
          shareUrl,
          emailVerificationSent: Boolean(responseRecord.emailVerificationSentAt),
        }
      }
    }
  }

  return {
    record: toAttachmentPersistedResultPublicRecord(record),
    shareUrl,
    emailVerificationSent: Boolean(record.emailVerificationSentAt),
  }
})
