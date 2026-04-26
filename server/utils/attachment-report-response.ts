import type { AttachmentPersistedResultRecord } from '~~/shared/attachment/persistence'
import type {
  AttachmentReportOrderPublicRecord,
  AttachmentReportOrderRecord,
  AttachmentReportOrderResponse,
  AttachmentReportResultSummary,
} from '~~/shared/attachment/report-order'

export const toAttachmentReportOrderPublicRecord = (
  order: AttachmentReportOrderRecord,
): AttachmentReportOrderPublicRecord => ({
  token: order.token,
  resultToken: order.resultToken,
  reportVersion: order.reportVersion,
  status: order.status,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  paidAt: order.paidAt,
  downloadedAt: order.downloadedAt,
})

export const toAttachmentReportResultSummary = (
  record: AttachmentPersistedResultRecord,
): AttachmentReportResultSummary => ({
  token: record.token,
  type: record.result.type,
  label: record.result.content.label,
  shortSummary: record.result.content.shortSummary,
  subprofileLabel: record.result.subprofileLabel,
})

export const toAttachmentReportOrderResponse = (
  order: AttachmentReportOrderRecord,
  resultRecord: AttachmentPersistedResultRecord,
  downloadUrl: string | null,
): AttachmentReportOrderResponse => ({
  order: toAttachmentReportOrderPublicRecord(order),
  result: toAttachmentReportResultSummary(resultRecord),
  downloadUrl,
})
