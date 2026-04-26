import { randomBytes } from 'node:crypto'
import {
  ATTACHMENT_PDF_REPORT_VERSION,
  type AttachmentReportCheckoutResponse,
  type AttachmentReportOrderRecord,
} from '~~/shared/attachment/report-order'
import { getAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import {
  getAttachmentReportOrderRecord,
  saveAttachmentReportOrderRecord,
} from '~~/server/utils/attachment-report-order-store'
import {
  toAttachmentReportOrderPublicRecord,
  toAttachmentReportResultSummary,
} from '~~/server/utils/attachment-report-response'
import {
  getPaddleCheckoutConfig,
  getPaddleCheckoutConfigError,
} from '~~/server/utils/paddle-config'

const resultTokenPattern = /^[a-f0-9]{16}$/i

const createOrderToken = () => randomBytes(16).toString('hex')

const createUniqueOrderToken = async () => {
  let token = createOrderToken()

  while (await getAttachmentReportOrderRecord(token)) {
    token = createOrderToken()
  }

  return token
}

export default defineEventHandler(async (event): Promise<AttachmentReportCheckoutResponse> => {
  const resultToken = getRouterParam(event, 'resultToken')?.toLowerCase()

  if (!resultToken || !resultTokenPattern.test(resultToken)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  const paddleConfig = getPaddleCheckoutConfig()

  if (!paddleConfig) {
    throw createError({
      statusCode: 503,
      statusMessage: getPaddleCheckoutConfigError() || 'Paid report checkout is not configured yet.',
    })
  }

  const resultRecord = await getAttachmentResultRecord(resultToken)

  if (!resultRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  const requestUrl = getRequestURL(event)
  const orderToken = await createUniqueOrderToken()
  const now = new Date().toISOString()
  const accessUrl = `${requestUrl.origin}/reports/attachment/${orderToken}`
  const order: AttachmentReportOrderRecord = {
    token: orderToken,
    resultToken,
    reportVersion: ATTACHMENT_PDF_REPORT_VERSION,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    paidAt: null,
    downloadedAt: null,
    paddleTransactionId: '',
    paddleEventId: '',
    paddleCustomerId: '',
    customerEmail: resultRecord.email,
    currencyCode: '',
    totalAmount: '',
    reportReadyEmailSentAt: null,
  }

  await saveAttachmentReportOrderRecord(order)

  return {
    order: toAttachmentReportOrderPublicRecord(order),
    result: toAttachmentReportResultSummary(resultRecord),
    paddle: {
      clientToken: paddleConfig.clientToken,
      environment: paddleConfig.environment,
      priceId: paddleConfig.priceId,
      items: [
        {
          priceId: paddleConfig.priceId,
          quantity: 1,
        },
      ],
      customData: {
        kind: 'attachment_pdf_report',
        orderToken,
        resultToken,
        reportVersion: ATTACHMENT_PDF_REPORT_VERSION,
      },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        locale: 'en',
        successUrl: `${accessUrl}?checkout=complete`,
      },
    },
    accessUrl,
  }
})
