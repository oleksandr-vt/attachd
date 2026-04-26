import {
  getAttachmentResultRecordByEmailVerificationHash,
  updateAttachmentResultRecord,
} from '~~/server/utils/attachment-result-store'
import { sendAttachmentWelcomeEmail } from '~~/server/utils/attachment-email'
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

  let verifiedRecord = record

  if (!record.emailVerifiedAt) {
    verifiedRecord = await updateAttachmentResultRecord(record.token, (currentRecord) => ({
      ...currentRecord,
      emailVerifiedAt: new Date().toISOString(),
    })) ?? record
  }

  if (!verifiedRecord.welcomeEmailSentAt) {
    const requestUrl = getRequestURL(event)
    const resultUrl = `${requestUrl.origin}/r/${verifiedRecord.token}`
    const paidReportUrl = `${resultUrl}#paid-report`
    const welcomeEmailSent = await sendAttachmentWelcomeEmail(verifiedRecord, resultUrl, paidReportUrl)

    if (welcomeEmailSent) {
      await updateAttachmentResultRecord(verifiedRecord.token, (currentRecord) => ({
        ...currentRecord,
        welcomeEmailSentAt: new Date().toISOString(),
      }))
    }
  }

  return sendRedirect(event, `/r/${record.token}?email=verified`, 302)
})
