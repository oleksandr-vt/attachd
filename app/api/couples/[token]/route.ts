import type { AttachmentCouplesPersistedReportResponse } from '@/shared/attachment/couples-persistence'
import { getAttachmentCouplesReportRecord } from '@/server/utils/attachment-couples-report-store'
import { HttpError, getSiteOrigin, withErrorHandling } from '@/server/utils/next-guards'

export const GET = withErrorHandling(async (request: Request, context: RouteContext<'/api/couples/[token]'>) => {
  const { token } = await context.params

  if (!/^[a-f0-9]{16}$/i.test(token)) {
    throw new HttpError(404, 'Couples report not found')
  }

  const record = await getAttachmentCouplesReportRecord(token)

  if (!record) {
    throw new HttpError(404, 'Couples report not found')
  }

  return Response.json({
    record,
    shareUrl: `${getSiteOrigin(request)}/couples/${token}`,
  } satisfies AttachmentCouplesPersistedReportResponse)
})
