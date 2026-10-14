import {
  toAttachmentPersistedResultPublicRecord,
  type AttachmentPersistedResultResponse,
} from '@/shared/attachment/persistence'
import { getAttachmentResultRecord } from '@/server/utils/attachment-result-store'
import { HttpError, getSiteOrigin, withErrorHandling } from '@/server/utils/next-guards'

export const GET = withErrorHandling(async (request: Request, context: RouteContext<'/api/results/[token]'>) => {
  const { token } = await context.params

  if (!/^[a-f0-9]{16}$/i.test(token)) {
    throw new HttpError(404, 'Result not found')
  }

  const record = await getAttachmentResultRecord(token)

  if (!record) {
    throw new HttpError(404, 'Result not found')
  }

  return Response.json({
    record: toAttachmentPersistedResultPublicRecord(record),
    shareUrl: `${getSiteOrigin(request)}/r/${token}`,
    emailVerificationSent: Boolean(record.emailVerificationSentAt),
  } satisfies AttachmentPersistedResultResponse)
})
