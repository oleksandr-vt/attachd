import {
  claimAttachmentWelcomeEmail,
  getAttachmentResultRecordByEmailVerificationHash,
  markAttachmentResultEmailVerified,
  releaseAttachmentWelcomeEmailClaim,
} from '~~/server/utils/attachment-result-store'
import { sendAttachmentWelcomeEmail } from '~~/server/utils/attachment-email'
import {
  hashEmailVerificationToken,
  isEmailVerificationExpired,
  isEmailVerificationToken,
} from '~~/server/utils/email-verification'
import { getSiteOrigin } from '~~/server/utils/h3-guards'

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

  if (!record || !record.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email confirmation link is invalid or has already been replaced.',
    })
  }

  if (!record.emailVerifiedAt && isEmailVerificationExpired(record.emailVerificationExpiresAt)) {
    return sendRedirect(event, `/r/${record.token}?email=expired`, 302)
  }

  if (!record.emailVerifiedAt) {
    await markAttachmentResultEmailVerified(record.token)
  }

  if (await claimAttachmentWelcomeEmail(record.token)) {
    const siteOrigin = getSiteOrigin(event)
    const resultUrl = `${siteOrigin}/r/${record.token}`
    const couplesUrl = `${siteOrigin}/couples?self=${record.token}`
    const welcomeEmailSent = await sendAttachmentWelcomeEmail(record, resultUrl, couplesUrl)

    if (!welcomeEmailSent) {
      await releaseAttachmentWelcomeEmailClaim(record.token)
    }
  }

  return sendRedirect(event, `/r/${record.token}?email=verified`, 302)
})
