import type { AttachmentReportOrderResponse } from '~~/shared/attachment/report-order'
import { getAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import { getAttachmentReportOrderRecord } from '~~/server/utils/attachment-report-order-store'
import { toAttachmentReportOrderResponse } from '~~/server/utils/attachment-report-response'

const orderTokenPattern = /^[a-f0-9]{32}$/i

export default defineEventHandler(async (event): Promise<AttachmentReportOrderResponse> => {
  const orderToken = getRouterParam(event, 'orderToken')?.toLowerCase()

  if (!orderToken || !orderTokenPattern.test(orderToken)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Report order not found',
    })
  }

  const order = await getAttachmentReportOrderRecord(orderToken)

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Report order not found',
    })
  }

  const resultRecord = await getAttachmentResultRecord(order.resultToken)

  if (!resultRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Source result not found',
    })
  }

  return toAttachmentReportOrderResponse(
    order,
    resultRecord,
    order.status === 'paid' ? `/api/reports/attachment/${order.token}/download` : null,
  )
})
