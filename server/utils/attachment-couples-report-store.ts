import { eq } from 'drizzle-orm'
import type { AttachmentCouplesPersistedReportRecord } from '~~/shared/attachment/couples-persistence'
import { getDb } from '~~/server/db/client'
import {
  attachmentCouplesReports,
  mapAttachmentCouplesReportRecordToRow,
  mapAttachmentCouplesReportRowToRecord,
} from '~~/server/db/schema'

const getUpdatableAttachmentCouplesReportRow = (record: AttachmentCouplesPersistedReportRecord) => {
  const { token: _token, ...row } = mapAttachmentCouplesReportRecordToRow(record)
  return row
}

export const getAttachmentCouplesReportRecord = async (token: string) => {
  const db = getDb()
  const record = await db.query.attachmentCouplesReports.findFirst({
    where: eq(attachmentCouplesReports.token, token),
  })

  return record ? mapAttachmentCouplesReportRowToRecord(record) : null
}

export const saveAttachmentCouplesReportRecord = async (record: AttachmentCouplesPersistedReportRecord) => {
  const db = getDb()
  const row = mapAttachmentCouplesReportRecordToRow(record)

  await db
    .insert(attachmentCouplesReports)
    .values(row)
    .onConflictDoUpdate({
      target: attachmentCouplesReports.token,
      set: getUpdatableAttachmentCouplesReportRow(record),
    })
}
