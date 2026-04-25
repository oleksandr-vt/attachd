import {
  getAttachmentResultRecordByEmailVerificationHash,
  updateAttachmentResultRecord,
} from '~~/server/utils/attachment-result-store'
import {
  hashEmailVerificationToken,
  isEmailVerificationExpired,
  isEmailVerificationToken,
} from '~~/server/utils/email-verification'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token

  if (!isEmailVerificationToken(token)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email confirmation link is invalid.',
    })
  }

  const tokenHash = hashEmailVerificationToken(token)
  const record = await getAttachmentResultRecordByEmailVerificationHash(tokenHash)

  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email confirmation link is invalid or has already been replaced.',
    })
  }

  if (!record.emailVerifiedAt && isEmailVerificationExpired(record.emailVerificationExpiresAt)) {
    return sendRedirect(event, `/r/${record.token}?email=expired`, 302)
  }

  if (!record.emailVerifiedAt) {
    await updateAttachmentResultRecord(record.token, (currentRecord) => ({
      ...currentRecord,
      emailVerifiedAt: new Date().toISOString(),
    }))
  }

  return sendRedirect(event, `/r/${record.token}?email=verified`, 302)
})
