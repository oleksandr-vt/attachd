import { eq } from 'drizzle-orm'
import type { AttachmentReportOrderRecord } from '~~/shared/attachment/report-order'
import { getDb } from '~~/server/db/client'
import {
  attachmentReportOrders,
  mapAttachmentReportOrderRecordToRow,
  mapAttachmentReportOrderRowToRecord,
} from '~~/server/db/schema'

const getUpdatableAttachmentReportOrderRow = (record: AttachmentReportOrderRecord) => {
  const { token: _token, ...row } = mapAttachmentReportOrderRecordToRow(record)
  return row
}

export const getAttachmentReportOrderRecord = async (token: string) => {
  const db = getDb()
  const record = await db.query.attachmentReportOrders.findFirst({
    where: eq(attachmentReportOrders.token, token),
  })

  return record ? mapAttachmentReportOrderRowToRecord(record) : null
}

export const saveAttachmentReportOrderRecord = async (record: AttachmentReportOrderRecord) => {
  const db = getDb()
  const row = mapAttachmentReportOrderRecordToRow(record)

  await db
    .insert(attachmentReportOrders)
    .values(row)
    .onConflictDoUpdate({
      target: attachmentReportOrders.token,
      set: getUpdatableAttachmentReportOrderRow(record),
    })
}

export const updateAttachmentReportOrderRecord = async (
  token: string,
  updater: (record: AttachmentReportOrderRecord) => AttachmentReportOrderRecord,
) => {
  const db = getDb()

  return db.transaction(async (tx) => {
    const currentRecord = await tx.query.attachmentReportOrders.findFirst({
      where: eq(attachmentReportOrders.token, token),
    })

    if (!currentRecord) {
      return null
    }

    const nextRecord = updater(mapAttachmentReportOrderRowToRecord(currentRecord))

    await tx
      .update(attachmentReportOrders)
      .set(getUpdatableAttachmentReportOrderRow(nextRecord))
      .where(eq(attachmentReportOrders.token, token))

    return nextRecord
  })
}
