import type { AttachmentStyleType } from '../../app/data/tests/attachment'
import type { AttachmentCouplesReport } from './couples-report'
import type { AttachmentComputedResult } from './scoring'

export const ATTACHMENT_COUPLES_REPORT_VERSION = '2026-04-21-v1'

export type AttachmentCouplesPersistedReportRecord = {
  token: string
  slug: 'attachment-couples'
  createdAt: string
  reportVersion: string
  leftSourceToken: string
  rightSourceToken: string
  leftPrimaryType: AttachmentStyleType
  rightPrimaryType: AttachmentStyleType
  leftResult: AttachmentComputedResult
  rightResult: AttachmentComputedResult
  report: AttachmentCouplesReport
}

export type AttachmentCouplesPersistedReportResponse = {
  record: AttachmentCouplesPersistedReportRecord
  shareUrl: string
}
