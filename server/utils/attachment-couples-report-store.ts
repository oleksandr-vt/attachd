import { and, eq } from 'drizzle-orm'
import type { AttachmentCouplesPersistedReportRecord } from '@/shared/attachment/couples-persistence'
import { getDb } from '@/server/db/client'
import {
  attachmentCouplesReports,
  mapAttachmentCouplesReportRecordToRow,
  mapAttachmentCouplesReportRowToRecord,
} from '@/server/db/schema'

export const getAttachmentCouplesReportRecord = async (token: string) => {
  const db = getDb()
  const record = await db.query.attachmentCouplesReports.findFirst({
    where: eq(attachmentCouplesReports.token, token),
  })

  return record ? mapAttachmentCouplesReportRowToRecord(record) : null
}

export const findAttachmentCouplesReportBySourcePair = async (
  leftSourceToken: string,
  rightSourceToken: string,
  reportVersion: string,
) => {
  const db = getDb()
  const record = await db.query.attachmentCouplesReports.findFirst({
    where: and(
      eq(attachmentCouplesReports.leftSourceToken, leftSourceToken),
      eq(attachmentCouplesReports.rightSourceToken, rightSourceToken),
      eq(attachmentCouplesReports.reportVersion, reportVersion),
    ),
  })

  return record ? mapAttachmentCouplesReportRowToRecord(record) : null
}

export const insertAttachmentCouplesReportRecord = async (record: AttachmentCouplesPersistedReportRecord) => {
  const inserted = await getDb()
    .insert(attachmentCouplesReports)
    .values(mapAttachmentCouplesReportRecordToRow(record))
    .onConflictDoNothing({ target: attachmentCouplesReports.token })
    .returning({ token: attachmentCouplesReports.token })

  return inserted.length > 0
}
