import { generateAttachmentPdfReport } from '~~/server/utils/attachment-pdf-report'
import { getAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import {
  getAttachmentReportOrderRecord,
  updateAttachmentReportOrderRecord,
} from '~~/server/utils/attachment-report-order-store'

const orderTokenPattern = /^[a-f0-9]{32}$/i

export default defineEventHandler(async (event) => {
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

  if (order.status !== 'paid') {
    throw createError({
      statusCode: 403,
      statusMessage: 'This PDF report has not been paid for yet.',
    })
  }

  const resultRecord = await getAttachmentResultRecord(order.resultToken)

  if (!resultRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Source result not found',
    })
  }

  const pdfBuffer = await generateAttachmentPdfReport(resultRecord, order)
  const filename = `attachd-${resultRecord.primaryType}-attachment-report.pdf`

  await updateAttachmentReportOrderRecord(order.token, (currentOrder) => ({
    ...currentOrder,
    downloadedAt: currentOrder.downloadedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Length', String(pdfBuffer.byteLength))
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  setHeader(event, 'Cache-Control', 'private, no-store')

  return pdfBuffer
})
