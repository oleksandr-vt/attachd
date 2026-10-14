import type { NextRequest } from 'next/server'
import {
  claimAttachmentWelcomeEmail,
  getAttachmentResultRecordByEmailVerificationHash,
  markAttachmentResultEmailVerified,
  releaseAttachmentWelcomeEmailClaim,
} from '@/server/utils/attachment-result-store'
import { sendAttachmentWelcomeEmail } from '@/server/utils/attachment-email'
import {
  hashEmailVerificationToken,
  isEmailVerificationExpired,
  isEmailVerificationToken,
} from '@/server/utils/email-verification'
import { HttpError, getSiteOrigin, withErrorHandling } from '@/server/utils/next-guards'

const redirectTo = (location: string) => new Response(null, { status: 302, headers: { Location: location } })

export const GET = withErrorHandling(async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token')

  if (!isEmailVerificationToken(token)) {
    throw new HttpError(400, 'Email confirmation link is invalid.')
  }

  const tokenHash = hashEmailVerificationToken(token)
  const record = await getAttachmentResultRecordByEmailVerificationHash(tokenHash)

  if (!record || !record.email) {
    throw new HttpError(400, 'Email confirmation link is invalid or has already been replaced.')
  }

  if (!record.emailVerifiedAt && isEmailVerificationExpired(record.emailVerificationExpiresAt)) {
    return redirectTo(`/r/${record.token}?email=expired`)
  }

  if (!record.emailVerifiedAt) {
    await markAttachmentResultEmailVerified(record.token)
  }

  if (await claimAttachmentWelcomeEmail(record.token)) {
    const siteOrigin = getSiteOrigin(request)
    const resultUrl = `${siteOrigin}/r/${record.token}`
    const couplesUrl = `${siteOrigin}/couples?self=${record.token}`
    const welcomeEmailSent = await sendAttachmentWelcomeEmail(record, resultUrl, couplesUrl)

    if (!welcomeEmailSent) {
      await releaseAttachmentWelcomeEmailClaim(record.token)
    }
  }

  return redirectTo(`/r/${record.token}?email=verified`)
})
