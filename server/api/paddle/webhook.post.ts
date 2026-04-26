import { createHmac, timingSafeEqual } from 'node:crypto'
import {
  ATTACHMENT_PDF_REPORT_VERSION,
  type AttachmentReportOrderRecord,
} from '~~/shared/attachment/report-order'
import { getAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import {
  getAttachmentReportOrderRecord,
  updateAttachmentReportOrderRecord,
} from '~~/server/utils/attachment-report-order-store'
import { sendAttachmentPdfReadyEmail } from '~~/server/utils/attachment-email'
import {
  getPaddleWebhookEventRecord,
  markPaddleWebhookEventError,
  markPaddleWebhookEventProcessed,
  savePaddleWebhookEventRecord,
} from '~~/server/utils/paddle-webhook-event-store'
import { getPaddleWebhookSecret } from '~~/server/utils/paddle-config'

type PaddleWebhookPayload = {
  event_id?: unknown
  event_type?: unknown
  notification_id?: unknown
  data?: unknown
}

type FulfillmentResult = {
  status: 'fulfilled' | 'ignored'
  reason?: string
}

const signatureToleranceSeconds = 300

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const asString = (value: unknown) =>
  typeof value === 'string' ? value : ''

const asRecordArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.filter(isRecord) : []

const parsePaddleSignature = (signatureHeader: string) => {
  const parts = signatureHeader.split(';').map((part) => part.trim())
  const timestamp = parts
    .find((part) => part.startsWith('ts='))
    ?.slice(3) ?? ''
  const signatures = parts
    .filter((part) => part.startsWith('h1='))
    .map((part) => part.slice(3))
    .filter(Boolean)

  return {
    timestamp,
    signatures,
  }
}

const timingSafeStringEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left, 'hex')
  const rightBuffer = Buffer.from(right, 'hex')

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

const verifyPaddleSignature = (
  rawBody: string,
  signatureHeader: string,
  secret: string,
) => {
  if (!signatureHeader || !secret) {
    return false
  }

  const { timestamp, signatures } = parsePaddleSignature(signatureHeader)
  const timestampSeconds = Number(timestamp)

  if (!timestamp || !Number.isFinite(timestampSeconds) || !signatures.length) {
    return false
  }

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds)

  if (ageSeconds > signatureToleranceSeconds) {
    return false
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${timestamp}:${rawBody}`)
    .digest('hex')

  return signatures.some((signature) => timingSafeStringEqual(signature, expectedSignature))
}

const extractPriceIds = (data: Record<string, unknown>) => {
  const priceIds = new Set<string>()

  for (const item of asRecordArray(data.items)) {
    const price = isRecord(item.price) ? item.price : null
    const priceId = asString(price?.id)

    if (priceId) {
      priceIds.add(priceId)
    }
  }

  const details = isRecord(data.details) ? data.details : null
  const lineItems = asRecordArray(details?.line_items)

  for (const lineItem of lineItems) {
    const priceId = asString(lineItem.price_id)
    const price = isRecord(lineItem.price) ? lineItem.price : null
    const nestedPriceId = asString(price?.id)

    if (priceId) {
      priceIds.add(priceId)
    }

    if (nestedPriceId) {
      priceIds.add(nestedPriceId)
    }
  }

  return priceIds
}

const extractTotalAmount = (data: Record<string, unknown>) => {
  const details = isRecord(data.details) ? data.details : null
  const totals = isRecord(details?.totals) ? details.totals : null
  const value = totals?.total ?? totals?.grand_total ?? totals?.subtotal

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return ''
}

const extractCustomerEmail = (data: Record<string, unknown>) => {
  const customer = isRecord(data.customer) ? data.customer : null
  return asString(data.customer_email) || asString(customer?.email)
}

const updateOrderAsPaid = async (
  order: AttachmentReportOrderRecord,
  data: Record<string, unknown>,
  eventId: string,
) => {
  const now = new Date().toISOString()
  const customerEmail = extractCustomerEmail(data) || order.customerEmail

  return updateAttachmentReportOrderRecord(order.token, (currentOrder) => {
    if (currentOrder.status === 'paid') {
      return {
        ...currentOrder,
        updatedAt: now,
      }
    }

    return {
      ...currentOrder,
      status: 'paid',
      updatedAt: now,
      paidAt: now,
      paddleTransactionId: asString(data.id),
      paddleEventId: eventId,
      paddleCustomerId: asString(data.customer_id),
      customerEmail,
      currencyCode: asString(data.currency_code),
      totalAmount: extractTotalAmount(data),
    }
  })
}

const maybeSendPdfReadyEmail = async (
  order: AttachmentReportOrderRecord,
  requestOrigin: string,
) => {
  if (order.reportReadyEmailSentAt) {
    return
  }

  const resultRecord = await getAttachmentResultRecord(order.resultToken)

  if (!resultRecord?.email) {
    return
  }

  const reportUrl = `${requestOrigin}/reports/attachment/${order.token}`
  const emailSent = await sendAttachmentPdfReadyEmail(resultRecord, reportUrl)

  if (!emailSent) {
    return
  }

  await updateAttachmentReportOrderRecord(order.token, (currentOrder) => ({
    ...currentOrder,
    reportReadyEmailSentAt: currentOrder.reportReadyEmailSentAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

const fulfillAttachmentPdfReportOrder = async (
  payload: PaddleWebhookPayload,
  requestOrigin: string,
): Promise<FulfillmentResult> => {
  if (payload.event_type !== 'transaction.completed' || !isRecord(payload.data)) {
    return {
      status: 'ignored',
      reason: 'Unsupported event type',
    }
  }

  const data = payload.data
  const customData = isRecord(data.custom_data) ? data.custom_data : null

  if (!customData || asString(customData.kind) !== 'attachment_pdf_report') {
    return {
      status: 'ignored',
      reason: 'Missing attachment PDF custom data',
    }
  }

  const orderToken = asString(customData.orderToken).toLowerCase()
  const resultToken = asString(customData.resultToken).toLowerCase()
  const reportVersion = asString(customData.reportVersion)

  if (!/^[a-f0-9]{32}$/i.test(orderToken) || !/^[a-f0-9]{16}$/i.test(resultToken)) {
    return {
      status: 'ignored',
      reason: 'Invalid report custom data tokens',
    }
  }

  if (reportVersion !== ATTACHMENT_PDF_REPORT_VERSION) {
    return {
      status: 'ignored',
      reason: 'Unexpected report version',
    }
  }

  const expectedPriceId = process.env.PADDLE_PDF_PRICE_ID?.trim()

  if (!expectedPriceId) {
    throw new Error('PADDLE_PDF_PRICE_ID is not configured.')
  }

  if (!extractPriceIds(data).has(expectedPriceId)) {
    return {
      status: 'ignored',
      reason: 'Unexpected Paddle price id',
    }
  }

  const order = await getAttachmentReportOrderRecord(orderToken)

  if (!order) {
    return {
      status: 'ignored',
      reason: 'Report order not found',
    }
  }

  if (order.resultToken !== resultToken) {
    return {
      status: 'ignored',
      reason: 'Result token mismatch',
    }
  }

  const resultRecord = await getAttachmentResultRecord(order.resultToken)

  if (!resultRecord) {
    return {
      status: 'ignored',
      reason: 'Source result not found',
    }
  }

  const updatedOrder = await updateOrderAsPaid(order, data, asString(payload.event_id))

  if (updatedOrder) {
    await maybeSendPdfReadyEmail(updatedOrder, requestOrigin)
  }

  return {
    status: 'fulfilled',
  }
}

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event, 'utf8')
  const signatureHeader = getHeader(event, 'paddle-signature') ?? ''
  const webhookSecret = getPaddleWebhookSecret()

  if (!rawBody || !verifyPaddleSignature(rawBody, signatureHeader, webhookSecret)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Paddle webhook signature.',
    })
  }

  let payload: PaddleWebhookPayload

  try {
    payload = JSON.parse(rawBody) as PaddleWebhookPayload
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Paddle webhook payload.',
    })
  }

  const eventId = asString(payload.event_id)
  const eventType = asString(payload.event_type)

  if (!eventId || !eventType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Paddle webhook event.',
    })
  }

  const existingEvent = await getPaddleWebhookEventRecord(eventId)

  if (existingEvent?.processedAt) {
    return {
      ok: true,
      status: 'already_processed',
    }
  }

  if (!existingEvent) {
    await savePaddleWebhookEventRecord({
      eventId,
      eventType,
      notificationId: asString(payload.notification_id),
      receivedAt: new Date().toISOString(),
      processedAt: null,
      processingError: '',
    })
  }

  try {
    const requestUrl = getRequestURL(event)
    const fulfillment = await fulfillAttachmentPdfReportOrder(payload, requestUrl.origin)
    const processingError = fulfillment.status === 'ignored'
      ? fulfillment.reason ?? 'Ignored event'
      : ''

    await markPaddleWebhookEventProcessed(eventId, processingError)

    return {
      ok: true,
      status: fulfillment.status,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Paddle webhook error'
    await markPaddleWebhookEventError(eventId, message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Paddle webhook could not be processed.',
    })
  }
})
