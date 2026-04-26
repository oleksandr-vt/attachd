import type { AttachmentStyleType } from '../../app/data/tests/attachment'

export const ATTACHMENT_PDF_REPORT_VERSION = '2026-04-26-v1'

export const attachmentReportOrderStatuses = [
  'pending',
  'paid',
  'failed',
] as const

export type AttachmentReportOrderStatus = typeof attachmentReportOrderStatuses[number]

export type AttachmentReportOrderRecord = {
  token: string
  resultToken: string
  reportVersion: string
  status: AttachmentReportOrderStatus
  createdAt: string
  updatedAt: string
  paidAt: string | null
  downloadedAt: string | null
  paddleTransactionId: string
  paddleEventId: string
  paddleCustomerId: string
  customerEmail: string
  currencyCode: string
  totalAmount: string
  reportReadyEmailSentAt: string | null
}

export type AttachmentReportOrderPublicRecord = Pick<
  AttachmentReportOrderRecord,
  | 'token'
  | 'resultToken'
  | 'reportVersion'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'paidAt'
  | 'downloadedAt'
>

export type AttachmentReportResultSummary = {
  token: string
  type: AttachmentStyleType
  label: string
  shortSummary: string
  subprofileLabel: string
}

export type AttachmentReportCheckoutResponse = {
  order: AttachmentReportOrderPublicRecord
  result: AttachmentReportResultSummary
  paddle: {
    clientToken: string
    environment: 'production' | 'sandbox'
    priceId: string
    items: Array<{
      priceId: string
      quantity: number
    }>
    customData: Record<string, string>
    settings: {
      displayMode: 'overlay'
      theme: 'light'
      locale: 'en'
      successUrl: string
    }
  }
  accessUrl: string
}

export type AttachmentReportOrderResponse = {
  order: AttachmentReportOrderPublicRecord
  result: AttachmentReportResultSummary
  downloadUrl: string | null
}

export const isAttachmentReportOrderStatus = (value: string): value is AttachmentReportOrderStatus =>
  attachmentReportOrderStatuses.includes(value as AttachmentReportOrderStatus)
