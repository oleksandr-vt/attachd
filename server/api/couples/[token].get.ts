import type { AttachmentCouplesPersistedReportResponse } from '~~/shared/attachment/couples-persistence'
import { getAttachmentCouplesReportRecord } from '~~/server/utils/attachment-couples-report-store'

export default defineEventHandler(async (event): Promise<AttachmentCouplesPersistedReportResponse> => {
  const token = getRouterParam(event, 'token')

  if (!token || !/^[a-f0-9]{16}$/i.test(token)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Couples report not found',
    })
  }

  const record = await getAttachmentCouplesReportRecord(token)

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Couples report not found',
    })
  }

  const requestUrl = getRequestURL(event)

  return {
    record,
    shareUrl: `${requestUrl.origin}/couples/${token}`,
  }
})
